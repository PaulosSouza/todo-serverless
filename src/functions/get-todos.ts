import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "@utils/dynamodbClient";
import { Todo } from "src/types/Todo";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id: user_id } = event.pathParameters;

  const { Items } = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  const todos = Items as Todo[];

  return {
    statusCode: 200,
    body: JSON.stringify({
      todos,
    }),
  };
};
