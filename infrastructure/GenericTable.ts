import { Stack } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs";
import { join } from "path";

export interface GenericTableProps {
  tableName: string;
  primaryKey: string;

  createLambdaPath?: string;
  readLambdaPath?: string;
  updateLambdaPath?: string;
  deleteLambdaPath?: string;
}

export class GenericTable {
  private table: Table;

  private createLambda: NodejsFunction | undefined;
  private readLambda: NodejsFunction | undefined;
  private updateLambda: NodejsFunction | undefined;
  private deleteLambda: NodejsFunction | undefined;

  public createLambdaIntegration: LambdaIntegration;
  public readLambdaIntegration: LambdaIntegration;
  public updateLambdaIntegration: LambdaIntegration;
  public deleteLambdaIntegration: LambdaIntegration;

  constructor(private stack: Stack, private tableProps: GenericTableProps) {
    this.initialize();
  }

  private initialize() {
    this.createTable();
    this.createLambdas();
    this.grantTableRights();
  }

  private createTable() {
    this.table = new Table(this.stack, this.tableProps.tableName, {
      partitionKey: {
        name: this.tableProps.primaryKey,
        type: AttributeType.STRING,
      },
      tableName: this.tableProps.tableName,
    });
  }

  private createLambdas() {
    if (this.tableProps.createLambdaPath) {
      this.createLambda = this.createSingleLambda(
        this.tableProps.createLambdaPath
      );
      this.createLambdaIntegration = new LambdaIntegration(this.createLambda);
    }
    if (this.tableProps.readLambdaPath) {
      this.readLambda = this.createSingleLambda(this.tableProps.readLambdaPath);
      this.readLambdaIntegration = new LambdaIntegration(this.readLambda);
    }
    if (this.tableProps.updateLambdaPath) {
      this.updateLambda = this.createSingleLambda(
        this.tableProps.updateLambdaPath
      );
      this.updateLambdaIntegration = new LambdaIntegration(this.updateLambda);
    }
    if (this.tableProps.deleteLambdaPath) {
      this.deleteLambda = this.createSingleLambda(
        this.tableProps.deleteLambdaPath
      );
      this.deleteLambdaIntegration = new LambdaIntegration(this.deleteLambda);
    }
  }

  private createSingleLambda(lambdaName: string): NodejsFunction {
    const lambdaId = `${this.tableProps.tableName}-${lambdaName}`;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(
        __dirname,
        "..",
        "services",
        this.tableProps.tableName,
        `${lambdaName}.ts`
      ),
      handler: "handler",
      functionName: lambdaId,
      environment: {
        TABLE_NAME: this.tableProps.tableName,
        PRIMARY_KEY: this.tableProps.primaryKey,
      },
    });
  }

  private grantTableRights() {
    if (this.createLambda) {
      this.table.grantWriteData(this.createLambda);
    }
    if (this.readLambda) {
      this.table.grantReadData(this.readLambda);
    }
    if (this.updateLambda) {
      this.table.grantWriteData(this.updateLambda);
    }
    if (this.deleteLambda) {
      this.table.grantWriteData(this.deleteLambda);
    }
  }
}
