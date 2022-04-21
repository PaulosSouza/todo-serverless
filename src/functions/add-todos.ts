import { APIGatewayProxyHandler } from "aws-lambda";
import { generateV4 } from "@libs/uuid";

import { document } from "@utils/dynamodbClient";
import { Todo } from "src/types/Todo";

interface IAddTodosRequest {
  title: string;
  done: boolean;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id: user_id } = event.pathParameters;

  const { title, deadline, done } = JSON.parse(event.body) as IAddTodosRequest;

  const todo = {
    id: generateV4(),
    user_id,
    title,
    done,
    deadline,
  } as Todo;

  await document
    .put({
      TableName: "todos",
      Item: todo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      todo,
    }),
  };
};
