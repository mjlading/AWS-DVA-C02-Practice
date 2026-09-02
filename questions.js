window.QUESTIONS = [
  {
    id: 1,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A team notices that a Lambda function written in Node.js creates a new Amazon RDS Proxy client and downloads the same reference data on every invocation. The function has bursty traffic and must reduce average latency with minimal code changes. Which approach should the developer take?",
    selectCount: 1,
    options: [
      { id: "A", text: "Move the client initialization and reference-data load outside the handler so warm execution environments can reuse them." },
      { id: "B", text: "Increase the function timeout so initialization has more time to finish." },
      { id: "C", text: "Set reserved concurrency to 1 so the same environment is always reused." },
      { id: "D", text: "Invoke the function asynchronously so callers do not wait for initialization." }
    ],
    answers: ["A"],
    explanation: "Initializing reusable clients and static data outside the handler lets Lambda reuse them in warm environments and reduces repeated setup work. A larger timeout does not make calls faster, reserved concurrency does not guarantee a single warm environment, and asynchronous invocation only hides latency from callers.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html"
  },
  {
    id: 2,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A checkout API uses Lambda behind API Gateway. Traffic spikes predictably every weekday at 9:00 AM, and the first requests after idle periods violate a strict p99 latency target. Which Lambda feature best meets the requirement with the least development effort?",
    selectCount: 1,
    options: [
      { id: "A", text: "Enable Provisioned Concurrency on the production alias." },
      { id: "B", text: "Configure Reserved Concurrency equal to expected peak request volume." },
      { id: "C", text: "Increase the API Gateway payload size limit." },
      { id: "D", text: "Publish more function versions and let API Gateway round-robin between them." }
    ],
    answers: ["A"],
    explanation: "Provisioned Concurrency keeps execution environments pre-initialized for low-latency starts during known spikes. Reserved Concurrency limits or reserves capacity but does not pre-warm environments, and the other choices do not address cold starts.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html"
  },
  {
    id: 3,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A Lambda function consumes SQS messages and writes to a legacy database that supports only 40 simultaneous connections. The queue can absorb bursts, but the database must be protected from overload. What should the developer configure?",
    selectCount: 1,
    options: [
      { id: "A", text: "Provisioned Concurrency of 40" },
      { id: "B", text: "Reserved Concurrency of 40" },
      { id: "C", text: "A queue retention period of 40 minutes" },
      { id: "D", text: "A batch window of 40 seconds" }
    ],
    answers: ["B"],
    explanation: "Reserved Concurrency caps the function's maximum concurrent executions and protects the downstream database. Provisioned Concurrency only pre-initializes environments, while queue retention and batch window settings do not directly limit database connection pressure.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html"
  },
  {
    id: 4,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A Java 17 Lambda function uses a large Spring Boot dependency set and has noticeable cold starts, but traffic is irregular so keeping environments warm all day would be expensive. Which option most directly reduces startup latency in a cost-effective way?",
    selectCount: 1,
    options: [
      { id: "A", text: "Enable SnapStart on a published version and invoke it through an alias." },
      { id: "B", text: "Enable Reserved Concurrency to keep the function initialized." },
      { id: "C", text: "Increase ephemeral storage to 10 GB." },
      { id: "D", text: "Split the function into two handlers with the same deployment package." }
    ],
    answers: ["A"],
    explanation: "Lambda SnapStart reduces Java startup time by restoring a snapshot of the initialized runtime for published versions. Reserved Concurrency does not keep environments warm, and the storage or handler changes do not target initialization latency directly.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"
  },
  {
    id: 5,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "An order processor uses Lambda with an Amazon SQS standard queue event source. A few malformed messages in a batch cause the function to fail, and successfully processed orders are retried and duplicated. Which changes should the developer make to minimize duplicate work? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Enable partial batch response handling on the event source mapping." },
      { id: "B", text: "Return a batchItemFailures list that identifies only the failed message IDs." },
      { id: "C", text: "Delete each successful message manually with DeleteMessage from the function." },
      { id: "D", text: "Reduce the queue visibility timeout below the function timeout." },
      { id: "E", text: "Throw an exception as soon as the first record fails so the whole batch is retried." }
    ],
    answers: ["A", "B"],
    explanation: "Partial batch responses let the function report only failed records so SQS retries just those messages. Manual deletes add unnecessary code, a shorter visibility timeout can worsen retries, and failing the whole batch repeats already successful work.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"
  },
  {
    id: 6,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An S3 bucket is configured to send ObjectCreated events to a Lambda function. Test uploads do not trigger the function. The function's execution role already allows s3:GetObject on the bucket. Which additional permission is required?",
    selectCount: 1,
    options: [
      { id: "A", text: "Add a resource-based policy on the Lambda function that allows s3.amazonaws.com to invoke it from that bucket." },
      { id: "B", text: "Add s3:PutBucketNotification to the function execution role." },
      { id: "C", text: "Replace the execution role with a service-linked role for S3." },
      { id: "D", text: "Grant the bucket permission to assume the function execution role." }
    ],
    answers: ["A"],
    explanation: "The execution role controls what the function can call, but S3 needs permission on the function itself to invoke it. The other options confuse invocation permissions with the function's outbound AWS access.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/permissions-function-services.html"
  },
  {
    id: 7,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A company exposes a REST API through Amazon API Gateway to a backend service that cannot be changed. Clients send JSON in one shape, but the backend requires a different payload and specific header names. The team wants to perform the translation in API Gateway with minimal backend changes. Which integration approach should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Lambda proxy integration" },
      { id: "B", text: "HTTP proxy integration" },
      { id: "C", text: "Non-proxy integration with mapping templates" },
      { id: "D", text: "WebSocket integration with route responses" }
    ],
    answers: ["C"],
    explanation: "Non-proxy integrations let API Gateway transform requests and responses with mapping templates before the backend sees them. Proxy integrations largely pass through the payload, which does not satisfy the transformation requirement.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-lambda-non-proxy-integration.html"
  },
  {
    id: 8,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A maintenance script uses the AWS SDK to list objects in a large S3 bucket, but it stops after the first 1,000 keys and misses the rest. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Reissue ListObjectsV2 requests by following the continuation token or using an SDK paginator until the results are exhausted." },
      { id: "B", text: "Increase the Lambda memory setting so the SDK can return all objects in one response." },
      { id: "C", text: "Call HeadObject for every possible key prefix to discover additional objects." },
      { id: "D", text: "Switch the bucket to S3 Glacier Instant Retrieval so list calls return larger pages." }
    ],
    answers: ["A"],
    explanation: "S3 list APIs are paginated, so the code must continue with the returned token or use the SDK paginator abstraction. Memory size and storage class do not change the API page limit, and HeadObject is not a listing strategy.",
    reference: "https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/pagination.html"
  },
  {
    id: 9,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "A public REST API serves repetitive GET requests through API Gateway and Lambda. The backend is being overwhelmed by identical reads from some high-volume clients. Which TWO API Gateway features should the developer use to reduce backend load and enforce per-client throttling? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Enable method or stage caching for the GET operations." },
      { id: "B", text: "Attach the API to a usage plan with API keys plus throttle or quota settings." },
      { id: "C", text: "Use stage variables to point the API to a second Lambda function." },
      { id: "D", text: "Switch the integration to non-proxy so Velocity Template Language can be used." },
      { id: "E", text: "Enable binary media types for JSON responses." }
    ],
    answers: ["A", "B"],
    explanation: "API Gateway caching reduces repeated backend executions for cacheable reads, and usage plans enforce per-client throttling and quotas. Stage variables, mapping templates, and binary media settings do not solve repeated-read load or client-specific throttling.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html"
  },
  {
    id: 10,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A team wants its test and production API Gateway stages to call different Lambda function versions without changing client URLs. They also want to be able to promote a new version by repointing a stable name rather than editing the integration each time. What should the developer configure?",
    selectCount: 1,
    options: [
      { id: "A", text: "Separate Lambda functions for every stage and update the client endpoints during each release" },
      { id: "B", text: "Stage variables in API Gateway that reference Lambda aliases" },
      { id: "C", text: "Reserved Concurrency values that match the stage names" },
      { id: "D", text: "A single $LATEST function without versions or aliases" }
    ],
    answers: ["B"],
    explanation: "Stage variables can direct each API stage to a specific Lambda alias, and aliases can move between immutable versions during promotion. The other choices either force client changes or remove the safety of versioned deployments.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html"
  },
  {
    id: 11,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An orders table uses CustomerId as the partition key and OrderDate as the sort key. A mobile app must fetch the 20 most recent orders for one customer with low latency and minimal read capacity usage. Which DynamoDB operation should the application use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Scan the table and filter on CustomerId and OrderDate" },
      { id: "B", text: "GetItem with CustomerId only" },
      { id: "C", text: "Query the table using CustomerId and sort on OrderDate" },
      { id: "D", text: "Export the table to S3 and read the result with Athena" }
    ],
    answers: ["C"],
    explanation: "Query is optimized for retrieving items by partition key and optional sort key conditions, which matches this access pattern. Scan reads far more data than needed, GetItem cannot return a range of sort-key values, and the export path is not appropriate for request-time access.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html"
  },
  {
    id: 12,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A DynamoDB table already exists with TicketId as its primary key. The team discovers a new access pattern that requires queries by Status and CreatedAt, and the index must be added without recreating the table. Which index should the developer create?",
    selectCount: 1,
    options: [
      { id: "A", text: "Local secondary index" },
      { id: "B", text: "Global secondary index" },
      { id: "C", text: "DynamoDB Streams index" },
      { id: "D", text: "Time to Live index" }
    ],
    answers: ["B"],
    explanation: "A GSI can be added after table creation and can use a different partition key for the new access pattern. An LSI must be defined when the table is created and shares the base table partition key.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"
  },
  {
    id: 13,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "A session table stores short-lived authentication sessions in DynamoDB. Expired items should disappear automatically, and the company wants an asynchronous archive of those expirations in S3 with minimal operational overhead. Which TWO actions should the developer take? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Configure a TTL attribute on the table." },
      { id: "B", text: "Enable DynamoDB Streams and process expiration records with Lambda to write them to S3." },
      { id: "C", text: "Schedule a nightly Scan that deletes old items one by one." },
      { id: "D", text: "Add a local secondary index on the expiration time attribute." },
      { id: "E", text: "Turn on point-in-time recovery so expired items are exported automatically." }
    ],
    answers: ["A", "B"],
    explanation: "TTL provides automatic expiration, and Streams lets downstream code react to the service-generated deletes without polling. Scheduled scans add avoidable operational work, while indexes and point-in-time recovery do not automate archival of expirations.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html"
  },
  {
    id: 14,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "During checkout, an application must create an order record and decrement inventory in another DynamoDB table. If either write fails, neither change should be committed. Which approach meets this requirement?",
    selectCount: 1,
    options: [
      { id: "A", text: "Use BatchWriteItem for both tables" },
      { id: "B", text: "Use TransactWriteItems for the order and inventory updates" },
      { id: "C", text: "Use two UpdateItem calls and retry the second until it succeeds" },
      { id: "D", text: "Write the order first and reconcile inventory later with a scheduled job" }
    ],
    answers: ["B"],
    explanation: "TransactWriteItems provides all-or-nothing behavior across multiple items and tables. BatchWriteItem is not transactional, and separate writes or later reconciliation can leave the system in an inconsistent state.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html"
  },
  {
    id: 15,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "Two administrators can edit the same product record in DynamoDB. The application must prevent a stale update from silently overwriting a newer one with minimal additional infrastructure. What should the developer implement?",
    selectCount: 1,
    options: [
      { id: "A", text: "Always use Scan before UpdateItem so the latest value is returned" },
      { id: "B", text: "Add a version attribute and use a conditional update that succeeds only when the expected version matches" },
      { id: "C", text: "Turn on Time to Live for the product item" },
      { id: "D", text: "Route all writes through an SQS FIFO queue" }
    ],
    answers: ["B"],
    explanation: "A version check with a condition expression is the standard optimistic locking pattern for preventing lost updates. Scans do not make the write safe, TTL is unrelated, and forcing all writes through a queue adds operational complexity for a problem DynamoDB can solve directly.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html"
  },
  {
    id: 16,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "A browser-based application must let users upload 8-GB video files directly to Amazon S3 without sending the payload through the application servers. Uploads should survive network interruptions by retrying only failed parts. Which TWO actions should the developer take? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Start a multipart upload for the object." },
      { id: "B", text: "Generate presigned URLs for the UploadPart requests." },
      { id: "C", text: "Make the destination bucket public so the browser can PUT directly." },
      { id: "D", text: "Use a single presigned PutObject URL for the entire 8-GB file." },
      { id: "E", text: "Stream the file through API Gateway so retries are centralized." }
    ],
    answers: ["A", "B"],
    explanation: "Multipart upload plus presigned UploadPart URLs allows direct, secure browser uploads and selective retries for failed parts. Public buckets reduce security, a single PutObject upload does not meet the resilient part-retry goal, and routing through API Gateway adds unnecessary bottlenecks.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
  },
  {
    id: 17,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A build system stores artifacts in Amazon S3. After 30 days, artifacts are rarely accessed but must be retained for one year and retrieved within minutes when needed. Which S3 feature should the developer use for the least operational overhead?",
    selectCount: 1,
    options: [
      { id: "A", text: "S3 Lifecycle rules to transition objects to a lower-cost storage class such as Glacier Instant Retrieval after 30 days" },
      { id: "B", text: "A daily Lambda function that copies objects to Amazon EBS snapshots" },
      { id: "C", text: "An SQS queue that moves object metadata after 30 days" },
      { id: "D", text: "A bucket policy that denies reads on old objects" }
    ],
    answers: ["A"],
    explanation: "Lifecycle rules automate storage-class transitions based on age without custom code or jobs. The other options do not manage storage cost effectively and add unnecessary operational work.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"
  },
  {
    id: 18,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An application stores uploaded images in Amazon S3 and must start thumbnail generation as soon as each object is created. The processing path must tolerate duplicate notifications so the same thumbnail is not generated twice. Which design best meets these requirements?",
    selectCount: 1,
    options: [
      { id: "A", text: "Poll the bucket every minute from an EC2 instance and compare object lists" },
      { id: "B", text: "Use S3 event notifications to invoke a Lambda function, and record a unique object identifier in DynamoDB with a conditional write before processing" },
      { id: "C", text: "Make the bucket public and let clients call the thumbnail API after upload" },
      { id: "D", text: "Use an S3 Lifecycle rule to trigger image processing when objects age by one day" }
    ],
    answers: ["B"],
    explanation: "S3 event notifications provide near-real-time triggers, and a conditional write gives an idempotency gate so duplicate notifications do not create duplicate work. Polling is heavier, public access is unnecessary, and lifecycle rules are not event-processing triggers.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html"
  },
  {
    id: 19,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A microservice occasionally receives throttling and transient network errors when calling DynamoDB. The team wants the most AWS-native retry behavior with the least custom code. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Implement a tight while loop that retries immediately until the call succeeds" },
      { id: "B", text: "Use the AWS SDK retry mode that applies exponential backoff with jitter" },
      { id: "C", text: "Increase the HTTP timeout and disable retries" },
      { id: "D", text: "Fail every request and rely on users to resubmit" }
    ],
    answers: ["B"],
    explanation: "The SDK's built-in retry modes are designed for transient AWS service failures and apply safer backoff behavior than ad hoc loops. Immediate retries amplify throttling, and disabling retries or punting to users reduces resiliency.",
    reference: "https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html"
  },
  {
    id: 20,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "A retailer is designing several event-driven components. One requirement needs simple pub/sub fan-out of business events to multiple subscribers. Another requires ordered record processing with replay for analytics consumers. A third requires a multi-step order workflow with retries and approval steps. Which THREE AWS services best fit these needs? Select THREE.",
    selectCount: 3,
    options: [
      { id: "A", text: "Amazon SNS" },
      { id: "B", text: "Amazon Kinesis Data Streams" },
      { id: "C", text: "AWS Step Functions" },
      { id: "D", text: "Amazon Route 53" },
      { id: "E", text: "AWS Secrets Manager" },
      { id: "F", text: "AWS CodeArtifact" }
    ],
    answers: ["A", "B", "C"],
    explanation: "SNS fits simple fan-out, Kinesis Data Streams supports ordered streaming with replay, and Step Functions is built for coordinated workflows with retries and human steps. The other services do not match those event-processing requirements.",
    reference: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html"
  },
  {
    id: 21,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An application running on Amazon EC2 uses an instance profile to access AWS APIs. Security reviewers want to reduce the risk of server-side request forgery against instance metadata without moving credentials into code. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Disable the instance profile and embed access keys in the AMI" },
      { id: "B", text: "Require IMDSv2 so metadata requests must use a session token" },
      { id: "C", text: "Open port 80 in the security group only to trusted IP addresses" },
      { id: "D", text: "Replace the instance profile with long-lived IAM user credentials in Parameter Store" }
    ],
    answers: ["B"],
    explanation: "IMDSv2 requires a session-oriented token flow that helps protect the metadata endpoint from SSRF-style abuse. Moving to long-lived keys weakens security, and security groups do not control link-local metadata access.",
    reference: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html"
  },
  {
    id: 22,
    domain: "Security",
    type: "single",
    prompt: "A consumer web application needs managed user sign-up, sign-in, and JWT token issuance for authenticated access to API Gateway. Which AWS service should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Amazon Cognito user pool" },
      { id: "B", text: "Amazon Cognito identity pool" },
      { id: "C", text: "AWS STS AssumeRole" },
      { id: "D", text: "AWS Directory Service" }
    ],
    answers: ["A"],
    explanation: "A Cognito user pool is the managed user directory and authentication service that issues tokens for application sign-in. Identity pools provide temporary AWS credentials after identity is established, and STS alone is not the user directory.",
    reference: "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html"
  },
  {
    id: 23,
    domain: "Security",
    type: "single",
    prompt: "After users authenticate, a single-page application must upload files directly to a private S3 bucket with temporary AWS credentials and no embedded access keys. Which service should the developer add?",
    selectCount: 1,
    options: [
      { id: "A", text: "Amazon Cognito user pool" },
      { id: "B", text: "Amazon Cognito identity pool" },
      { id: "C", text: "AWS IAM Access Analyzer" },
      { id: "D", text: "AWS Certificate Manager" }
    ],
    answers: ["B"],
    explanation: "An identity pool exchanges authenticated identities for temporary AWS credentials that can be scoped to S3 access. A user pool authenticates users but does not itself hand out those AWS credentials.",
    reference: "https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html"
  },
  {
    id: 24,
    domain: "Security",
    type: "multiple",
    prompt: "A mobile app uses Amazon Cognito so users can sign in and then call Amazon S3 directly with temporary, least-privilege AWS credentials. Which TWO statements correctly describe this design? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "A Cognito user pool authenticates users and can issue JWT tokens." },
      { id: "B", text: "A Cognito identity pool exchanges validated identities for temporary AWS credentials through AWS STS." },
      { id: "C", text: "A Cognito user pool directly returns long-lived access keys for S3." },
      { id: "D", text: "A Cognito identity pool stores usernames and passwords for local sign-in." },
      { id: "E", text: "AWS STS replaces the need for any identity source in this flow." }
    ],
    answers: ["A", "B"],
    explanation: "User pools handle sign-in and token issuance, while identity pools map those identities to temporary STS credentials for AWS access. The other options confuse authentication, credential type, and the role of STS in the flow.",
    reference: "https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html"
  },
  {
    id: 25,
    domain: "Security",
    type: "single",
    prompt: "A platform team wants development teams to create IAM roles for their own applications, but no delegated role should ever be able to exceed a centrally approved maximum permission set. Which IAM feature should the platform team use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Service control policies on the application roles" },
      { id: "B", text: "Permissions boundaries" },
      { id: "C", text: "Inline session policies on IAM users" },
      { id: "D", text: "Access keys with limited duration" }
    ],
    answers: ["B"],
    explanation: "Permissions boundaries define the maximum permissions that a delegated principal can grant to roles it creates or manages. Service control policies work at the account or organizational level, and the other choices do not cap role permissions in this way.",
    reference: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"
  },
  {
    id: 26,
    domain: "Security",
    type: "single",
    prompt: "A developer has an IAM policy that allows s3:GetObject on a bucket. Requests still fail when the application uses plain HTTP instead of HTTPS because the bucket policy denies non-TLS access. Why does the request fail?",
    selectCount: 1,
    options: [
      { id: "A", text: "The IAM allow on the user overrides the bucket policy deny" },
      { id: "B", text: "S3 ignores bucket policies when an identity policy exists" },
      { id: "C", text: "An explicit deny in the bucket policy overrides the allow" },
      { id: "D", text: "The request must come from the root user to use HTTPS conditions" }
    ],
    answers: ["C"],
    explanation: "AWS policy evaluation always honors explicit deny over any allow, whether the allow is identity-based or resource-based. That is why the bucket policy condition blocks the request even though the caller has an allow elsewhere.",
    reference: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"
  },
  {
    id: 27,
    domain: "Security",
    type: "single",
    prompt: "A deployment system in Account A must create stacks in Account B. Security requirements forbid long-lived access keys in the pipeline. What is the recommended approach?",
    selectCount: 1,
    options: [
      { id: "A", text: "Create an IAM user in Account B and store its keys in the pipeline" },
      { id: "B", text: "Create a role in Account B that trusts the pipeline principal in Account A, and assume it with AWS STS" },
      { id: "C", text: "Make the Account B resources public to the pipeline IP range" },
      { id: "D", text: "Copy the CloudFormation templates into Account B manually before each deployment" }
    ],
    answers: ["B"],
    explanation: "Cross-account role assumption with STS avoids long-lived keys and is the standard least-privilege pattern for automation across accounts. IAM users with stored keys increase risk, and the other options do not provide secure deployment access.",
    reference: "https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html"
  },
  {
    id: 28,
    domain: "Security",
    type: "multiple",
    prompt: "An application role in Account A must read objects from a private S3 bucket in Account B. The solution must stay least-privilege and avoid public access. Which TWO configurations are required? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Grant s3:GetObject to the role in Account A with an identity-based policy scoped to the bucket objects." },
      { id: "B", text: "Add a bucket policy in Account B that grants the role in Account A permission to read the objects." },
      { id: "C", text: "Enable static website hosting on the bucket." },
      { id: "D", text: "Attach AmazonS3FullAccess to the role in Account A." },
      { id: "E", text: "Add a public-read ACL to the objects." }
    ],
    answers: ["A", "B"],
    explanation: "Cross-account S3 access normally requires an allow on the caller side and a bucket policy on the resource side. Public ACLs, website hosting, or overly broad managed policies violate the private and least-privilege requirements.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example2.html"
  },
  {
    id: 29,
    domain: "Security",
    type: "single",
    prompt: "An application running on ECS connects to Amazon Aurora. The database password must rotate automatically every 30 days without rebuilding the application image. Which AWS service is the best fit?",
    selectCount: 1,
    options: [
      { id: "A", text: "AWS Systems Manager Parameter Store standard parameter" },
      { id: "B", text: "AWS Secrets Manager with rotation enabled" },
      { id: "C", text: "Amazon S3 object versioning" },
      { id: "D", text: "AWS CodeDeploy lifecycle hooks" }
    ],
    answers: ["B"],
    explanation: "Secrets Manager is built for secret storage and automated rotation, including common database integrations. Parameter Store can store values but does not provide the same native rotation workflow, and the other choices are unrelated to credential management.",
    reference: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"
  },
  {
    id: 30,
    domain: "Security",
    type: "single",
    prompt: "A serverless application needs hierarchical environment settings such as /prod/api/baseUrl and /prod/featureFlags/newCheckout. These values are not highly sensitive, and the team wants a low-cost managed store. Which service should the developer choose?",
    selectCount: 1,
    options: [
      { id: "A", text: "Amazon Cognito" },
      { id: "B", text: "AWS Systems Manager Parameter Store" },
      { id: "C", text: "AWS Secrets Manager only" },
      { id: "D", text: "AWS Artifact" }
    ],
    answers: ["B"],
    explanation: "Parameter Store is a good fit for hierarchical configuration values and can optionally encrypt them, without the heavier focus of Secrets Manager on rotation workflows. Cognito and Artifact do not serve as general application configuration stores.",
    reference: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html"
  },
  {
    id: 31,
    domain: "Security",
    type: "single",
    prompt: "A desktop application encrypts large documents locally before uploading them to Amazon S3. The company wants to use AWS KMS, but the KMS key material must never leave the service and should not be used directly to encrypt large payloads. What should the application do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Call GenerateDataKey and use envelope encryption" },
      { id: "B", text: "Download the KMS key and cache it locally" },
      { id: "C", text: "Use Encrypt on the full document body regardless of size" },
      { id: "D", text: "Create a new KMS key for every document and store it in the file" }
    ],
    answers: ["A"],
    explanation: "Envelope encryption uses a plaintext data key locally while the customer managed KMS key stays inside KMS. The other options either violate KMS design, misuse the API for large payloads, or create unmanageable key sprawl.",
    reference: "https://docs.aws.amazon.com/kms/latest/developerguide/data-keys.html"
  },
  {
    id: 32,
    domain: "Security",
    type: "multiple",
    prompt: "A team needs a long-lived policy that defines who can administer and use a KMS key. They also need a temporary way for an AWS service to use the key during a specific workflow without repeatedly editing the key policy. Which TWO KMS features should they use? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "A key policy for the durable permissions model" },
      { id: "B", text: "A grant for temporary delegated use" },
      { id: "C", text: "A bucket policy on the encrypted S3 object" },
      { id: "D", text: "An IAM access key for the KMS key" },
      { id: "E", text: "A security group that allows outbound access to KMS" }
    ],
    answers: ["A", "B"],
    explanation: "Key policies are the primary resource-based permissions model for KMS keys, while grants are designed for scoped, temporary delegated use. Bucket policies and security groups do not define KMS key permissions, and KMS keys do not use access keys.",
    reference: "https://docs.aws.amazon.com/kms/latest/developerguide/grants.html"
  },
  {
    id: 33,
    domain: "Security",
    type: "single",
    prompt: "A SaaS platform encrypts data for many tenants with the same KMS key. The team wants an extra safeguard so decryption only succeeds when the request includes the correct tenant identifier. Which KMS feature should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Automatic key rotation" },
      { id: "B", text: "Encryption context with the tenant ID" },
      { id: "C", text: "Multi-Region keys" },
      { id: "D", text: "Asymmetric signing keys" }
    ],
    answers: ["B"],
    explanation: "Encryption context binds additional authenticated data, such as a tenant ID, to the cryptographic operation so the same context must be supplied on decrypt. Rotation, key geography, and signing keys do not enforce this tenant-aware check.",
    reference: "https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html"
  },
  {
    id: 34,
    domain: "Security",
    type: "single",
    prompt: "An API authorizes vendors to download private invoice PDFs from Amazon S3. Each vendor should get access only to the specific object they requested and only for a short time. What is the most secure and least operationally heavy approach?",
    selectCount: 1,
    options: [
      { id: "A", text: "Make the invoices bucket public and rely on unguessable object names" },
      { id: "B", text: "Generate a short-lived S3 presigned URL after the API authorizes the request" },
      { id: "C", text: "Create one IAM user per vendor and email long-lived access keys" },
      { id: "D", text: "Copy each invoice into a public bucket and delete it later" }
    ],
    answers: ["B"],
    explanation: "A short-lived presigned URL grants time-bound access to one object without exposing long-lived AWS credentials or making the bucket public. The other choices increase risk or operational burden and do not scope access as tightly.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html"
  },
  {
    id: 35,
    domain: "Security",
    type: "multiple",
    prompt: "A Lambda function needs a database password, a non-secret feature flag, and the smallest reasonable blast radius if credentials are misused. Which THREE actions should the developer take? Select THREE.",
    selectCount: 3,
    options: [
      { id: "A", text: "Store the database password in AWS Secrets Manager." },
      { id: "B", text: "Store the non-secret feature flag in AWS Systems Manager Parameter Store." },
      { id: "C", text: "Grant the execution role read access only to the specific secret and parameter it needs." },
      { id: "D", text: "Print the secret value to CloudWatch Logs at startup to confirm retrieval." },
      { id: "E", text: "Commit the secret as an encrypted string inside the source repository." },
      { id: "F", text: "Attach AdministratorAccess to the execution role to simplify secret retrieval." }
    ],
    answers: ["A", "B", "C"],
    explanation: "Secrets belong in Secrets Manager, non-secret config fits Parameter Store, and least-privilege access narrows the blast radius. Logging secret values, committing them into source control, or broadening permissions contradict secure configuration practices.",
    reference: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html"
  },
  {
    id: 36,
    domain: "Security",
    type: "single",
    prompt: "A Lambda function in the same account needs to decrypt data with a customer managed KMS key. The execution role has kms:Decrypt in its IAM policy, but calls still fail with AccessDeniedException. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "The function must run in a VPC to call KMS" },
      { id: "B", text: "The KMS key policy does not allow the principal to use the key" },
      { id: "C", text: "The Lambda timeout is too low for decryption" },
      { id: "D", text: "The ciphertext must be stored in DynamoDB instead of S3" }
    ],
    answers: ["B"],
    explanation: "KMS access is governed primarily by the key policy, so an IAM allow alone may not be enough. VPC placement, timeout tuning, and ciphertext storage location do not explain a KMS authorization failure.",
    reference: "https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html"
  },
  {
    id: 37,
    domain: "Security",
    type: "single",
    prompt: "A company allows a third-party SaaS vendor to assume a role in its account for log analysis. The company wants to reduce the confused deputy risk. What should the role trust policy include?",
    selectCount: 1,
    options: [
      { id: "A", text: "A condition that requires an ExternalId value supplied by the vendor" },
      { id: "B", text: "A condition that requires the vendor to use root credentials" },
      { id: "C", text: "A requirement that the vendor connect only from port 443" },
      { id: "D", text: "A policy statement that allows everyone in the vendor's AWS account" }
    ],
    answers: ["A"],
    explanation: "An ExternalId condition is the standard AWS safeguard against the confused deputy problem in third-party cross-account access. The other options either weaken security or are unrelated to role assumption trust controls.",
    reference: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html"
  },
  {
    id: 38,
    domain: "Security",
    type: "single",
    prompt: "An internal REST API in API Gateway uses IAM authorization. The API must be callable only through a specific VPC endpoint, even if a caller otherwise has IAM permission. Which control should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "A Lambda authorizer that checks the caller's IP address" },
      { id: "B", text: "An API Gateway resource policy that restricts access by aws:SourceVpce" },
      { id: "C", text: "A permissions boundary on the caller role" },
      { id: "D", text: "A CloudWatch alarm on unauthorized requests" }
    ],
    answers: ["B"],
    explanation: "An API Gateway resource policy can enforce network-origin conditions such as a specific VPC endpoint before the request reaches the backend. IAM permissions boundaries and alarms do not enforce this request path restriction.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html"
  },
  {
    id: 39,
    domain: "Deployment",
    type: "single",
    prompt: "A CodeBuild project compiles a Node.js application, runs unit tests, and packages a ZIP file. The team wants npm ci to run before the tests and packaging steps in a standard way. Where should that command be placed?",
    selectCount: 1,
    options: [
      { id: "A", text: "The install phase of buildspec.yml" },
      { id: "B", text: "The artifacts section of buildspec.yml" },
      { id: "C", text: "Only the post_build phase" },
      { id: "D", text: "The appspec.yml deployment hooks" }
    ],
    answers: ["A"],
    explanation: "The install phase is intended for setting up runtime dependencies before later build steps run. The artifacts section describes outputs, and appspec.yml belongs to CodeDeploy, not CodeBuild.",
    reference: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html"
  },
  {
    id: 40,
    domain: "Deployment",
    type: "multiple",
    prompt: "A CodeBuild project needs an npm authentication token at build time and must pass a packaged Lambda ZIP to a later CodePipeline deploy stage. Which TWO buildspec features should the developer use? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Use env parameter-store or secrets-manager mappings for the token." },
      { id: "B", text: "Declare the ZIP in the artifacts files section." },
      { id: "C", text: "Hardcode the token in buildspec.yml." },
      { id: "D", text: "Store the ZIP only on the ephemeral build container file system and omit artifacts." },
      { id: "E", text: "Put the token in a CodePipeline stage name." }
    ],
    answers: ["A", "B"],
    explanation: "Buildspec supports secure injection of secrets and explicit declaration of output artifacts for downstream pipeline stages. Hardcoding secrets or leaving artifacts only on the ephemeral container breaks security or promotion requirements.",
    reference: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html"
  },
  {
    id: 41,
    domain: "Deployment",
    type: "single",
    prompt: "A deployment pipeline should promote exactly the build output that passed tests, not repackage the source repository during deployment. How should the developer design the pipeline?",
    selectCount: 1,
    options: [
      { id: "A", text: "Configure the deploy stage to pull the latest source directly from the repository" },
      { id: "B", text: "Output the packaged artifact from CodeBuild and use that artifact as the input to the deploy action" },
      { id: "C", text: "Skip the build stage and let CodeDeploy compile the source" },
      { id: "D", text: "Store build logs in CloudWatch Logs and deploy them from there" }
    ],
    answers: ["B"],
    explanation: "Promoting the exact build artifact preserves the tested package across environments and avoids accidental drift. Redeploying directly from source can produce a different artifact than the one that passed validation.",
    reference: "https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome-introducing-artifacts.html"
  },
  {
    id: 42,
    domain: "Deployment",
    type: "single",
    prompt: "A Lambda function is deployed with CodeDeploy. The team wants 10% of traffic shifted to the new version first, followed by the remaining 90% after a bake period if alarms stay OK. Which deployment style is this?",
    selectCount: 1,
    options: [
      { id: "A", text: "All-at-once" },
      { id: "B", text: "In-place" },
      { id: "C", text: "Canary" },
      { id: "D", text: "Rolling" }
    ],
    answers: ["C"],
    explanation: "A canary deployment sends a small percentage first, waits, and then completes the shift if health signals remain good. All-at-once and in-place do not provide the same staged bake period behavior.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html"
  },
  {
    id: 43,
    domain: "Deployment",
    type: "single",
    prompt: "A Lambda release should move traffic to a new version in equal increments every few minutes until fully shifted. Which deployment configuration best matches this requirement?",
    selectCount: 1,
    options: [
      { id: "A", text: "Blue/green" },
      { id: "B", text: "Linear" },
      { id: "C", text: "Immutable" },
      { id: "D", text: "Recreate" }
    ],
    answers: ["B"],
    explanation: "Linear deployments shift traffic in consistent increments on a schedule, which is exactly what the scenario asks for. Blue/green and immutable describe different replacement models, not equal traffic increments over time.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html"
  },
  {
    id: 44,
    domain: "Deployment",
    type: "single",
    prompt: "A web application on EC2 instances behind an Application Load Balancer must deploy a new release with near-zero downtime and the ability to switch back quickly to the old fleet if health checks fail. Which deployment strategy should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Blue/green deployment" },
      { id: "B", text: "In-place deployment" },
      { id: "C", text: "Single instance deployment" },
      { id: "D", text: "Direct instance replacement by SSH" }
    ],
    answers: ["A"],
    explanation: "Blue/green creates a parallel replacement environment so traffic can be shifted and quickly reverted if needed. In-place updates alter the current fleet and do not provide the same rollback speed or isolation.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-create-ec2-blue-green.html"
  },
  {
    id: 45,
    domain: "Deployment",
    type: "single",
    prompt: "A licensed legacy application runs on EC2 instances managed by CodeDeploy. The company cannot temporarily double capacity, but it can update instances in sequence. Which deployment strategy should be used?",
    selectCount: 1,
    options: [
      { id: "A", text: "Blue/green" },
      { id: "B", text: "Canary" },
      { id: "C", text: "In-place" },
      { id: "D", text: "Immutable" }
    ],
    answers: ["C"],
    explanation: "In-place deployments update the existing instances, which fits the constraint that duplicate capacity is not available. Blue/green and immutable strategies require replacement capacity during rollout.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-create-ec2-in-place.html"
  },
  {
    id: 46,
    domain: "Deployment",
    type: "multiple",
    prompt: "A Lambda application uses CodeDeploy traffic shifting. The release should automatically stop and roll back if the new version causes elevated 5XX errors or duration spikes after traffic is shifted. Which TWO configurations are required? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Associate CloudWatch alarms with the deployment group or deployment." },
      { id: "B", text: "Enable automatic rollback when a deployment fails or an alarm is triggered." },
      { id: "C", text: "Disable health checks during the rollout." },
      { id: "D", text: "Remove the old function version before the bake period starts." },
      { id: "E", text: "Increase the deployment batch size to 100% immediately." }
    ],
    answers: ["A", "B"],
    explanation: "CloudWatch alarms provide the health signal, and automatic rollback tells CodeDeploy how to act on that signal. The other choices either increase risk or remove the safety net that staged deployments are meant to provide.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html"
  },
  {
    id: 47,
    domain: "Deployment",
    type: "multiple",
    prompt: "Before the first cloud deployment of a serverless application, a developer wants to validate the SAM template, build dependencies, and invoke a function locally with a sample event. Which THREE SAM CLI commands should the developer use? Select THREE.",
    selectCount: 3,
    options: [
      { id: "A", text: "sam validate" },
      { id: "B", text: "sam build" },
      { id: "C", text: "sam local invoke" },
      { id: "D", text: "sam sync --watch" },
      { id: "E", text: "sam delete" }
    ],
    answers: ["A", "B", "C"],
    explanation: "sam validate checks template syntax, sam build prepares dependencies and artifacts, and sam local invoke runs the function locally. sam sync is for rapid cloud updates during iteration, and sam delete removes deployed resources.",
    reference: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html"
  },
  {
    id: 48,
    domain: "Deployment",
    type: "single",
    prompt: "A developer is iterating on Lambda handler code and wants code changes to reach the cloud quickly during development without performing a full CloudFormation deployment on every save. Which SAM CLI command is the best fit?",
    selectCount: 1,
    options: [
      { id: "A", text: "sam publish" },
      { id: "B", text: "sam deploy --guided" },
      { id: "C", text: "sam sync --watch" },
      { id: "D", text: "sam package" }
    ],
    answers: ["C"],
    explanation: "sam sync --watch is designed for a fast inner loop by syncing code changes to the cloud as files change. Full deploy or package flows are slower and more appropriate for formal deployment steps.",
    reference: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-sync.html"
  },
  {
    id: 49,
    domain: "Deployment",
    type: "single",
    prompt: "A developer has already built a SAM application and now wants to upload artifacts to Amazon S3 and apply the infrastructure changes as a CloudFormation stack update. Which command should be used?",
    selectCount: 1,
    options: [
      { id: "A", text: "sam list resources" },
      { id: "B", text: "sam deploy" },
      { id: "C", text: "sam traces" },
      { id: "D", text: "sam logs" }
    ],
    answers: ["B"],
    explanation: "sam deploy uploads artifacts and drives the CloudFormation deployment for the application stack. The other commands inspect deployed resources, traces, or logs but do not perform the deployment itself.",
    reference: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html"
  },
  {
    id: 50,
    domain: "Deployment",
    type: "multiple",
    prompt: "A CloudFormation stack creates an S3 bucket and then runs a custom resource that seeds initial documents into the bucket. The custom resource must not start before the bucket exists, and the documents must remain even if the stack is deleted later. Which TWO template features should the developer use? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "DependsOn on the custom resource so it waits for the bucket." },
      { id: "B", text: "DeletionPolicy: Retain on the bucket resource." },
      { id: "C", text: "UpdateReplacePolicy: Delete on the bucket resource." },
      { id: "D", text: "Metadata on the custom resource." },
      { id: "E", text: "Outputs that reference the bucket name." }
    ],
    answers: ["A", "B"],
    explanation: "DependsOn enforces creation order, and DeletionPolicy: Retain preserves the bucket and its contents when the stack is deleted. Metadata and Outputs are informational, while UpdateReplacePolicy: Delete does the opposite of the retention requirement.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html"
  },
  {
    id: 51,
    domain: "Deployment",
    type: "single",
    prompt: "Before updating a production CloudFormation stack, a team wants to review the exact resource modifications that AWS plans to make. Which CloudFormation feature should they use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Drift detection" },
      { id: "B", text: "StackSets" },
      { id: "C", text: "Change sets" },
      { id: "D", text: "Export names" }
    ],
    answers: ["C"],
    explanation: "Change sets show the proposed resource changes before execution so the team can review impact ahead of time. Drift detection checks for divergence after deployment, while StackSets and exports solve different problems.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html"
  },
  {
    id: 52,
    domain: "Deployment",
    type: "single",
    prompt: "A serverless application exposes stable prod and beta endpoints. Each endpoint must refer to immutable Lambda code, and traffic should be movable by repointing a named reference instead of changing client integrations. What should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Separate $LATEST functions for prod and beta" },
      { id: "B", text: "Lambda versions with aliases" },
      { id: "C", text: "Reserved Concurrency and event source mappings" },
      { id: "D", text: "One function URL per commit hash" }
    ],
    answers: ["B"],
    explanation: "Published versions give immutable code references, and aliases provide stable names that integrations can target while the underlying version changes. The other choices either rely on mutable code or do not address release routing.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html"
  },
  {
    id: 53,
    domain: "Deployment",
    type: "single",
    prompt: "Five Lambda functions written in Python all depend on the same PDF library and shared utilities. The team wants to reduce deployment package duplication and update that shared dependency independently. Which Lambda feature should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Destinations" },
      { id: "B", text: "Layers" },
      { id: "C", text: "Provisioned Concurrency" },
      { id: "D", text: "Dead-letter queues" }
    ],
    answers: ["B"],
    explanation: "Lambda layers are meant for versioned shared code and dependencies used by multiple functions. Destinations, concurrency controls, and DLQs address invocation behavior rather than package reuse.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html"
  },
  {
    id: 54,
    domain: "Deployment",
    type: "multiple",
    prompt: "A Dockerized web application runs on AWS Elastic Beanstalk in dev and prod. The team wants safer application updates and different database endpoints in each environment without rebuilding the image for every environment. Which TWO actions should the developer take? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Use an Elastic Beanstalk deployment policy such as immutable or rolling with additional batch for safer releases." },
      { id: "B", text: "Store environment-specific settings as Elastic Beanstalk environment properties or referenced configuration values instead of baking them into the image." },
      { id: "C", text: "Build a separate container image for each environment even when only configuration changes." },
      { id: "D", text: "SSH to each instance after deployment and edit the container settings manually." },
      { id: "E", text: "Put production and development databases behind the same DNS name so the image never changes." }
    ],
    answers: ["A", "B"],
    explanation: "Elastic Beanstalk deployment policies improve rollout safety, and keeping environment-specific configuration outside the image supports clean promotion of the same artifact. Rebuilding per environment or making manual instance edits increases drift and operational overhead.",
    reference: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html"
  },
  {
    id: 55,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A team wants to search AWS X-Ray traces for a specific tenantId across requests. The tenantId must be indexed so it can be used in filter expressions. Where should the developer store this value?",
    selectCount: 1,
    options: [
      { id: "A", text: "In X-Ray metadata" },
      { id: "B", text: "In CloudTrail event history" },
      { id: "C", text: "In an X-Ray annotation" },
      { id: "D", text: "In the segment name only" }
    ],
    answers: ["C"],
    explanation: "Annotations are indexed and searchable in X-Ray, which makes them suitable for fields like tenantId. Metadata can hold rich context but is not indexed for filter expressions.",
    reference: "https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-segment.html"
  },
  {
    id: 56,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "An application flow is API Gateway to Lambda to DynamoDB. Developers want end-to-end distributed traces with the least custom instrumentation. What should they enable?",
    selectCount: 1,
    options: [
      { id: "A", text: "CloudTrail data events on all services" },
      { id: "B", text: "Active tracing for API Gateway and Lambda so trace context is propagated" },
      { id: "C", text: "Only VPC Flow Logs on the Lambda subnets" },
      { id: "D", text: "S3 server access logging on the deployment bucket" }
    ],
    answers: ["B"],
    explanation: "Active tracing enables X-Ray trace generation and propagation through supported services with minimal extra code. CloudTrail and network logs are useful for auditing or networking, but they do not create end-to-end request traces.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html"
  },
  {
    id: 57,
    domain: "Troubleshooting and Optimization",
    type: "multiple",
    prompt: "A payment service emits large volumes of structured application logs. The team wants near-real-time custom metrics from those logs without making synchronous PutMetricData calls, and it also wants an alarm when the literal text \"payment failed\" appears in plain-text logs from a legacy component. Which TWO CloudWatch features should the developer use? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "CloudWatch Embedded Metric Format for the structured logs" },
      { id: "B", text: "CloudWatch Logs metric filters for the legacy log pattern" },
      { id: "C", text: "AWS Config custom rules" },
      { id: "D", text: "CloudFormation drift detection" },
      { id: "E", text: "S3 Inventory reports" }
    ],
    answers: ["A", "B"],
    explanation: "EMF lets applications emit metrics asynchronously through logs, and metric filters turn matching log patterns into metrics that can drive alarms. The other services do not extract real-time application metrics from logs for this use case.",
    reference: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html"
  },
  {
    id: 58,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "Yesterday, a production outage was caused by an IAM policy change. The team needs to identify which principal made the change and when it happened. Which AWS service should the developer check first?",
    selectCount: 1,
    options: [
      { id: "A", text: "AWS CloudTrail" },
      { id: "B", text: "Amazon Inspector" },
      { id: "C", text: "AWS X-Ray" },
      { id: "D", text: "Amazon CloudFront" }
    ],
    answers: ["A"],
    explanation: "CloudTrail records management API activity, including who changed IAM resources and when. X-Ray traces application requests, and Inspector or CloudFront are not the first source for IAM change attribution.",
    reference: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html"
  },
  {
    id: 59,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A Lambda function compresses files and spends most of its time on CPU work. It is not close to its configured memory limit, but execution duration is high. Which change is most likely to improve performance?",
    selectCount: 1,
    options: [
      { id: "A", text: "Increase the function memory setting to allocate more CPU" },
      { id: "B", text: "Decrease the timeout so slow executions fail faster" },
      { id: "C", text: "Lower reserved concurrency to 1" },
      { id: "D", text: "Move logs from CloudWatch to S3" }
    ],
    answers: ["A"],
    explanation: "Lambda allocates CPU proportionally with memory, so increasing memory can accelerate CPU-bound work and often reduce duration. The other options do not add compute and therefore do not address the root bottleneck.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html"
  },
  {
    id: 60,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A customer-facing Lambda function has spiky traffic and occasionally sits idle long enough for cold starts to reappear. The team wants the most direct way to reduce startup latency for that endpoint. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Increase the batch size of the event source mapping" },
      { id: "B", text: "Enable Provisioned Concurrency on the production alias" },
      { id: "C", text: "Switch the function to asynchronous invocation" },
      { id: "D", text: "Store more data in the /tmp directory" }
    ],
    answers: ["B"],
    explanation: "Provisioned Concurrency is the direct latency optimization for cold-start-sensitive endpoints because it keeps environments ready to serve requests. The other choices do not keep invocation capacity warm for synchronous traffic.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html"
  },
  {
    id: 61,
    domain: "Troubleshooting and Optimization",
    type: "multiple",
    prompt: "A service that calls DynamoDB and Amazon SQS experiences short bursts of throttling and transient failures. Which THREE client behaviors align with AWS retry best practices? Select THREE.",
    selectCount: 3,
    options: [
      { id: "A", text: "Use exponential backoff between retries." },
      { id: "B", text: "Add jitter so many clients do not retry in lockstep." },
      { id: "C", text: "Prefer the AWS SDK retry mode instead of a tight custom immediate retry loop." },
      { id: "D", text: "Retry indefinitely with no upper bound and no timeout." },
      { id: "E", text: "Disable idempotency checks because retries should always create a new result." }
    ],
    answers: ["A", "B", "C"],
    explanation: "Exponential backoff, jitter, and the SDK's built-in retry logic help absorb transient faults without amplifying load. Unbounded retries can cascade failures, and safe retries generally benefit from idempotent operations rather than the opposite.",
    reference: "https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html"
  },
  {
    id: 62,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A DynamoDB table has plenty of overall write capacity, but one partition key receives almost all writes and is being throttled. What is the best long-term fix?",
    selectCount: 1,
    options: [
      { id: "A", text: "Increase the table's item size so writes are distributed more evenly" },
      { id: "B", text: "Redesign the partition key or add write sharding to spread traffic across more partition values" },
      { id: "C", text: "Replace Query operations with Scan operations" },
      { id: "D", text: "Turn on Time to Live for the hot items" }
    ],
    answers: ["B"],
    explanation: "Hot partitions are a data-modeling problem, so the durable fix is to spread traffic across partition key values. Scans, TTL, or larger items do not redistribute the write load that is causing throttling.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html"
  },
  {
    id: 63,
    domain: "Troubleshooting and Optimization",
    type: "multiple",
    prompt: "A request flows through API Gateway, Lambda, Step Functions, and another Lambda. The operations team wants to troubleshoot one request quickly across all components. Which TWO practices provide the most useful correlation? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Generate or reuse a correlation ID at the entry point and pass it through every downstream call, event, or state transition." },
      { id: "B", text: "Log structured JSON that includes the correlation ID in each component." },
      { id: "C", text: "Use a different random request ID format in every service and never propagate it." },
      { id: "D", text: "Write only free-form text logs so developers can search manually." },
      { id: "E", text: "Disable X-Ray so the logs remain the sole source of truth." }
    ],
    answers: ["A", "B"],
    explanation: "A propagated correlation ID plus structured logs gives operators a reliable way to join records across services. Random per-service IDs, unstructured logs, or turning off tracing all make cross-service diagnosis harder.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs-logformat.html"
  },
  {
    id: 64,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A Lambda-backed API repeatedly reads the same reference items from DynamoDB, and the dataset changes only a few times per hour. The team wants lower read latency and reduced DynamoDB traffic for these hot keys. Which service should the developer add?",
    selectCount: 1,
    options: [
      { id: "A", text: "Amazon DynamoDB Accelerator (DAX)" },
      { id: "B", text: "Amazon EMR" },
      { id: "C", text: "AWS Glue Data Catalog" },
      { id: "D", text: "Amazon Kinesis Data Firehose" }
    ],
    answers: ["A"],
    explanation: "DAX is a managed in-memory cache designed specifically to accelerate DynamoDB reads and reduce repeated read traffic. The other services address analytics, metadata, or data delivery, not request-time key-value caching.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"
  },
  {
    id: 65,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A new workload in a secondary Region scales up successfully until Lambda account-level concurrency is exhausted, causing throttles across unrelated functions. The functions do not have reserved concurrency set. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Increase the function timeout on every affected function" },
      { id: "B", text: "Request a higher regional concurrency quota through Service Quotas" },
      { id: "C", text: "Reduce the number of CloudWatch log streams" },
      { id: "D", text: "Replace all functions with EC2 instances" }
    ],
    answers: ["B"],
    explanation: "This is an account-level concurrency limit issue, so the correct remedy is a regional quota increase. Timeout and log settings do not raise concurrency capacity, and replacing the architecture is unnecessary for a quota problem.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"
  }
];
