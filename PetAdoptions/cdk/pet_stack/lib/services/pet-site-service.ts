import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { EcsService, EcsServiceProps } from './ecs-service'

export class PetSiteService extends EcsService {

  constructor(scope: cdk.Construct, id: string, props: EcsServiceProps) {
    super(scope, id, props);

    const startStepFnExecutionPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'states:StartExecution'
      ],
      resources: ['*']
    });

    this.taskDefinition.taskRole?.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, 'AmazonSQSFullAccess', 'arn:aws:iam::aws:policy/AmazonSQSFullAccess'));
    this.taskDefinition.taskRole?.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, 'AmazonSNSFullAccess', 'arn:aws:iam::aws:policy/AmazonSNSFullAccess'));
    this.taskDefinition.taskRole?.addToPrincipalPolicy(startStepFnExecutionPolicy);
  }

  createContainerImage() : ecs.ContainerImage {
    return ecs.ContainerImage.fromAsset("../../petsite/petsite", {
      repositoryName: "pet-site"
    })
  }
}