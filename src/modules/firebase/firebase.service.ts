import { Injectable } from '@nestjs/common';
import { chunk } from 'lodash';
import * as shell from 'shelljs';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
}

@Injectable()
export class FirebaseService {
  constructor() {}

  public async sendFirebaseMessages(
    firebaseMessages: ISendFirebaseMessages[],
  ): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);
    const batchResponses = await mapLimit<
      ISendFirebaseMessages[],
      BatchResponse
    >(
      batchedFirebaseMessages,
      process.env.FIREBASE_PARALLEL_LIMIT, // 3 is a good place to start
      async (
        groupedFirebaseMessages: ISendFirebaseMessages[],
      ): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] = groupedFirebaseMessages.map(
            ({ message, title, token }) => ({
              notification: { body: message, title },
              token,
              apns: {
                payload: {
                  aps: {
                    'content-available': 1,
                  },
                },
              },
            }),
          );
          return await this.sendAll(tokenMessages);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );
    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      ({
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown) as BatchResponse,
    );
  }

  public async sendFirebaseMessage(
    firebaseMessages: ISendFirebaseMessages
  ): Promise<BatchResponse> {
    try {
      const tokenMessages: firebase.messaging.TokenMessage[] = [
        {
          notification: { body: firebaseMessages.message, title: firebaseMessages.title },
          token: firebaseMessages.token,
          apns: {
            payload: {
              aps: {
                'content-available': 1,
              },
            },
          },
        },
      ];
      return await this.sendAll(tokenMessages);
    } catch (error) {
      return {
        responses: [
          {
            success: false,
            error,
          },
        ],
        successCount: 0,
        failureCount: 1,
      };
    }
  }

  public async sendAll(
    messages: firebase.messaging.TokenMessage[],
  ): Promise<BatchResponse> {
    if (process.env.NODE_ENV === 'local') {
      for (const { notification, token } of messages) {
        shell.exec(
          `echo '{ "aps": { "alert": ${JSON.stringify(
            notification,
          )}, "token": "${token}" } }' | xcrun simctl push booted com.company.appname -`,
        );
      }
    }
    return firebase.messaging().sendAll(messages, true);
  }
}