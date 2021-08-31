import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/lib/aws-apigateway";
import { join } from "path";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/lib/aws-iam";
import { SPACES_TABLE_NAME } from "../constants";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "spaceApi");
  private spacesTable = new GenericTable(this, {
    tableName: SPACES_TABLE_NAME,
    primaryKey: "spaceId",
    secondaryIndeces: ["location", "name"],
    createLambdaPath: "Create",
    readLambdaPath: "Read",
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Lambda function
    const helloLambdaNodejs = new NodejsFunction(this, "helloLambdaNodejs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    // New policy for listing s3 buckets
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");

    // attach this policy to lambda function
    helloLambdaNodejs.addToRolePolicy(s3ListPolicy);

    // Hello api lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodejs);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);

    // Spaces API integration
    const spaceResource = this.api.root.addResource("spaces");
    spaceResource.addMethod("POST", this.spacesTable.createLambdaIntegration);
    spaceResource.addMethod("GET", this.spacesTable.readLambdaIntegration);
  }
}
