import { APIGatewayProxyHandler } from "aws-lambda";
import { generateV4 } from "@libs/uuid";
import { document } from "@utils/dynamodbClient";

interface IAddTodosRequest {
  title: string;
  done: boolean;
  deadline: Date;
}

interface IAddTodosDTO {
  id: string;
  user_id: string;
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
  } as IAddTodosDTO;

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
