window.EXAM_QUESTIONS = [
  {
    id: 101,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An application reads 10 items per second from a DynamoDB table in provisioned capacity mode, and every read must be strongly consistent. Each item is 6 KB. The same application writes 20 items per second, and each written item is 1.5 KB. What is the minimum provisioned capacity that avoids throttling?",
    selectCount: 1,
    options: [
      { id: "A", text: "20 RCU and 40 WCU" },
      { id: "B", text: "10 RCU and 40 WCU" },
      { id: "C", text: "15 RCU and 30 WCU" },
      { id: "D", text: "20 RCU and 20 WCU" }
    ],
    answers: ["A"],
    explanation: "One RCU covers one strongly consistent read per second of an item up to 4 KB, so a 6 KB item rounds up to 2 RCU per read and 10 reads per second need 20 RCU. One WCU covers one write per second of an item up to 1 KB, so a 1.5 KB item rounds up to 2 WCU per write and 20 writes per second need 40 WCU. Option B is what eventually consistent reads would need, because they consume half the RCU.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html"
  },
  {
    id: 102,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A DynamoDB table in provisioned mode has 500 WCU and consumes about 200 WCU at peak, yet PutItem calls intermittently fail with ProvisionedThroughputExceededException. The table has one global secondary index that was created with 50 WCU. Every item written to the table contains the index key attributes. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "The global secondary index has insufficient write capacity, and throttling on the index throttles writes to the base table." },
      { id: "B", text: "The base table needs auto scaling because 500 WCU cannot absorb 200 WCU bursts." },
      { id: "C", text: "PutItem consumes double capacity when the item already exists, so effective usage is 400 WCU." },
      { id: "D", text: "Global secondary indexes share the base table's capacity, so the index must be converted to a local secondary index." }
    ],
    answers: ["A"],
    explanation: "A global secondary index has its own provisioned throughput. When an item write must be propagated to the index and the index lacks write capacity, DynamoDB throttles the write on the base table even though the table itself has headroom. Local secondary indexes share base-table capacity, but an LSI cannot be created on an existing table and would not fix the mismatch. PutItem on an existing item does not double the capacity charge.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html#GSI.ThroughputConsiderations"
  },
  {
    id: 103,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A developer runs a DynamoDB Query with a key condition on CustomerId, a FilterExpression on Status = 'OPEN', and Limit = 10. The response contains only 3 items and includes a LastEvaluatedKey, even though the customer has more than 40 open orders. Why does this happen?",
    selectCount: 1,
    options: [
      { id: "A", text: "Limit caps the number of items evaluated before the filter is applied, so the application must continue paginating with ExclusiveStartKey until LastEvaluatedKey is absent." },
      { id: "B", text: "The table's read capacity was exhausted, so DynamoDB returned a partial page and a resume token." },
      { id: "C", text: "FilterExpression is only supported on Scan, so Query silently ignores most of it." },
      { id: "D", text: "The Query hit the 1 MB result limit because the filtered items are large." }
    ],
    answers: ["A"],
    explanation: "DynamoDB applies Limit to the items read by the key condition, then applies the filter to that page. Filtered-out items still count against Limit and against consumed capacity, so a page can come back with fewer items than the limit while more data remains. The application must follow LastEvaluatedKey to get the rest. A 1 MB limit is real, but 10 small items would not reach it, and the other options are not how Query behaves.",
    reference: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.Limit"
  },
  {
    id: 104,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A Lambda function was attached to private subnets so it can reach an Amazon RDS database. Since the change, calls from the function to Amazon S3 time out. The subnets have no route to the internet, and the team wants the most cost-effective fix that keeps traffic on the AWS network. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Create a gateway VPC endpoint for Amazon S3 and add it to the route tables of the private subnets." },
      { id: "B", text: "Move the function to a public subnet so it receives a public IP address." },
      { id: "C", text: "Add an internet gateway route to the private subnets' route tables." },
      { id: "D", text: "Attach a NAT gateway in each Availability Zone and route 0.0.0.0/0 through it." }
    ],
    answers: ["A"],
    explanation: "A Lambda function in a VPC has only a private ENI and never gets a public IP, so moving it to a public subnet or adding an internet gateway route does nothing. A NAT gateway would work but costs money per hour and per GB and sends traffic through the internet path. A gateway endpoint for S3 is free, keeps traffic on the AWS network, and needs only a route table entry.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html"
  },
  {
    id: 105,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A Lambda function is invoked asynchronously by Amazon S3 event notifications. A small percentage of invocations fail after Lambda's built-in retries. The team must capture each failed event together with the function's error message and stack trace for later replay, with no changes to the function code. What should the developer configure?",
    selectCount: 1,
    options: [
      { id: "A", text: "An on-failure Lambda destination that sends the invocation record to an SQS queue" },
      { id: "B", text: "A dead-letter queue on the function that receives the original event" },
      { id: "C", text: "An SQS queue between S3 and Lambda with a redrive policy" },
      { id: "D", text: "CloudWatch Logs subscription filter on the function's log group" }
    ],
    answers: ["A"],
    explanation: "Both a dead-letter queue and an on-failure destination catch asynchronous failures, but only destinations deliver a full invocation record that includes the request payload, the response or error details, and context such as the request ID. A DLQ receives only the original event. Inserting a queue between S3 and Lambda changes the architecture and loses the error detail, and log subscriptions do not give a replayable event.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html"
  },
  {
    id: 106,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "A Lambda function consumes an Amazon Kinesis Data Stream through an event source mapping. When a single malformed record appears, the whole batch fails, Lambda retries the same batch until the record expires, and the shard stops making progress. The team wants healthy records processed and the bad record isolated with minimal code change. Which TWO event source mapping settings should the developer configure? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Enable BisectBatchOnFunctionError so failing batches are split and retried in halves." },
      { id: "B", text: "Set MaximumRetryAttempts and an on-failure destination so the failing record's metadata is sent to SQS or SNS after the retries are exhausted." },
      { id: "C", text: "Increase BatchSize so more records are processed per invocation." },
      { id: "D", text: "Increase ParallelizationFactor to 10 so other batches from the shard can run concurrently." },
      { id: "E", text: "Switch the stream to on-demand capacity mode." }
    ],
    answers: ["A", "B"],
    explanation: "Bisecting narrows a failing batch down to the poison record, and bounded retries with an on-failure destination let Lambda skip that record and move the shard iterator forward while preserving the metadata needed to find it later. A bigger batch only makes each failure more expensive. Parallelization factor increases concurrency per shard but still processes records in order per partition key, so the stuck batch still blocks its key, and stream capacity mode is unrelated to poison-record handling.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/services-kinesis-errors.html"
  },
  {
    id: 107,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "Three separate consumer applications read the same Amazon Kinesis Data Stream. Each consumer polls with GetRecords, and all three now report ReadProvisionedThroughputExceeded errors and rising latency. The team cannot add shards because the write rate is low. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Register each application as an enhanced fan-out consumer so each receives its own dedicated read throughput per shard over SubscribeToShard." },
      { id: "B", text: "Increase the stream's data retention period so consumers have more time to catch up." },
      { id: "C", text: "Use the Kinesis Producer Library to aggregate records so fewer GetRecords calls are needed." },
      { id: "D", text: "Enable server-side encryption on the stream to reduce the size of each record." }
    ],
    answers: ["A"],
    explanation: "Shared-throughput consumers split each shard's 2 MB per second read limit and 5 GetRecords calls per second between them. Enhanced fan-out gives every registered consumer a dedicated 2 MB per second per shard and pushes records over HTTP/2, which removes the contention without resharding. Retention affects how long data is kept, not read throughput, producer-side aggregation does not change consumer read limits, and encryption does not shrink data.",
    reference: "https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html"
  },
  {
    id: 108,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A fleet of IoT devices publishes telemetry to an Amazon Kinesis Data Stream with 20 shards. The producer uses the device's country code as the partition key. Producers in one country receive ProvisionedThroughputExceededException while overall stream utilization is under 30 percent. What is the best fix?",
    selectCount: 1,
    options: [
      { id: "A", text: "Use a high-cardinality partition key such as the device ID so records spread evenly across shards." },
      { id: "B", text: "Double the shard count so each country gets more capacity." },
      { id: "C", text: "Enable enhanced fan-out for the affected producers." },
      { id: "D", text: "Increase the retention period to 7 days so rejected records can be recovered." }
    ],
    answers: ["A"],
    explanation: "Partition keys are hashed to shards, so a low-cardinality key concentrates one country's traffic on a single shard and exceeds its 1 MB per second or 1,000 records per second write limit while other shards sit idle. Adding shards does not help because the hot key still maps to one shard. Enhanced fan-out is a consumer feature, and retention does not affect write throttling.",
    reference: "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
  },
  {
    id: 109,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A worker fleet processes messages from an Amazon SQS standard queue. Most messages finish in under a minute, but a few take up to 10 minutes. The queue visibility timeout is 2 minutes, and the long-running messages are being picked up by a second worker before the first finishes. The team wants to stop the duplicate processing without delaying redelivery of messages that genuinely fail. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Have the worker call ChangeMessageVisibility periodically to extend the timeout only for messages that are still being processed." },
      { id: "B", text: "Set the queue visibility timeout to 12 hours." },
      { id: "C", text: "Enable long polling with a 20 second wait time on ReceiveMessage." },
      { id: "D", text: "Convert the queue to a FIFO queue so each message is delivered once." }
    ],
    answers: ["A"],
    explanation: "Extending visibility from the consumer as a heartbeat keeps a message hidden only as long as it is actively being worked on, so failed messages still return quickly. A 12 hour timeout would delay every retry by up to 12 hours. Long polling reduces empty responses and cost but does not change visibility, and FIFO queues still redeliver a message when its visibility timeout expires before deletion.",
    reference: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"
  },
  {
    id: 110,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "An order service publishes events for many customers to an Amazon SQS FIFO queue. Events for one customer must be processed in order, events for different customers may be processed in parallel, and a producer retry must not create a duplicate. Which TWO actions should the developer take? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Set MessageGroupId to the customer ID on every message." },
      { id: "B", text: "Provide a MessageDeduplicationId per event or enable content-based deduplication on the queue." },
      { id: "C", text: "Use a single MessageGroupId for all messages so ordering is guaranteed." },
      { id: "D", text: "Set DelaySeconds on each message equal to the customer's processing priority." },
      { id: "E", text: "Use a standard queue and add a sequence number attribute that consumers sort on." }
    ],
    answers: ["A", "B"],
    explanation: "FIFO queues order messages within a message group and allow different groups to be consumed concurrently, so the customer ID is the right group key. Deduplication within the 5 minute window is driven by MessageDeduplicationId or by a content hash when content-based deduplication is enabled. A single group serializes all customers, FIFO queues do not support per-message delays, and a standard queue cannot guarantee ordering or exactly-once delivery.",
    reference: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html"
  },
  {
    id: 111,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A developer subscribes an existing Amazon SQS queue to an Amazon SNS topic. The subscription shows as confirmed, and Publish calls to the topic succeed, but no messages ever arrive in the queue. The developer's IAM role has full SNS and SQS permissions. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "The queue's access policy does not allow the SNS topic to call sqs:SendMessage." },
      { id: "B", text: "Raw message delivery is disabled, so SNS cannot serialize the message for SQS." },
      { id: "C", text: "The topic is a standard topic and the queue is a standard queue, which is an unsupported combination." },
      { id: "D", text: "The developer's role lacks sns:Subscribe, so the subscription is pending even though it appears confirmed." }
    ],
    answers: ["A"],
    explanation: "SNS delivers to SQS using the queue's resource-based policy, not the caller's IAM permissions. The queue policy must allow the sns.amazonaws.com principal to SendMessage, usually with a condition on aws:SourceArn matching the topic. Raw message delivery only changes the envelope format, standard to standard is fully supported, and the console creates that policy automatically, which is why the failure typically appears with pre-existing queues.",
    reference: "https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html"
  },
  {
    id: 112,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An Amazon SNS topic receives all order events. A Lambda function subscribed to the topic only cares about events where the eventType attribute equals REFUND, but it is invoked for every message and discards 95 percent of them. The publisher cannot be changed. What is the most cost-effective fix?",
    selectCount: 1,
    options: [
      { id: "A", text: "Add a subscription filter policy on the Lambda subscription that matches eventType equal to REFUND." },
      { id: "B", text: "Create a separate topic for refunds and have the publisher send refund events there." },
      { id: "C", text: "Insert an SQS queue between the topic and the function and set a redrive policy." },
      { id: "D", text: "Reduce the function's memory so discarded invocations cost less." }
    ],
    answers: ["A"],
    explanation: "A subscription filter policy makes SNS drop non-matching messages before delivery, so the function is only invoked for refund events and the publisher is untouched. A separate topic requires publisher changes, an intermediate queue still delivers every message, and reducing memory still pays for every invocation.",
    reference: "https://docs.aws.amazon.com/sns/latest/dg/sns-subscription-filter-policies.html"
  },
  {
    id: 113,
    domain: "Development with AWS Services",
    type: "multiple",
    prompt: "A Step Functions Standard workflow calls a third-party payment API from a Task state. The API occasionally returns throttling errors that succeed on retry, but sometimes it stays unavailable for hours. The team wants automatic retries with increasing delays, and after the retries are exhausted the workflow must route to a ManualReview state instead of failing. Which TWO changes should the developer make to the state definition? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Add a Retry field with ErrorEquals, IntervalSeconds, MaxAttempts, and BackoffRate." },
      { id: "B", text: "Add a Catch field with ErrorEquals and Next pointing to ManualReview." },
      { id: "C", text: "Insert a Wait state with a fixed 60 second delay before every call to the API." },
      { id: "D", text: "Wrap the Task in a Parallel state so a second branch can take over." },
      { id: "E", text: "Change the workflow type to Express so failed executions restart automatically." }
    ],
    answers: ["A", "B"],
    explanation: "Retry handles transient faults with exponential backoff inside the state, and Catch defines where the execution goes once retries are exhausted. A fixed Wait adds latency to every call without adapting to failures, Parallel does not provide failover semantics, and Express workflows do not restart failed executions and are limited to 5 minutes.",
    reference: "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html"
  },
  {
    id: 114,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A document approval workflow in Step Functions must pause after sending an email and wait for a manager to click an approve or reject link. Managers may take up to 3 days to respond. The wait must not consume compute or poll a database. Which integration pattern should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Invoke the notification task with the .waitForTaskToken suffix and have the link handler call SendTaskSuccess or SendTaskFailure with the token." },
      { id: "B", text: "Use an Express workflow with a Wait state configured for 3 days." },
      { id: "C", text: "Run a Lambda function in a loop that sleeps for 5 minutes and checks an approvals table." },
      { id: "D", text: "Use the .sync integration pattern so Step Functions waits for the email to be answered." }
    ],
    answers: ["A"],
    explanation: "The callback pattern pauses the execution until an external system returns the task token, which is designed for long human-in-the-loop waits and costs nothing while paused. Express workflows cannot run longer than 5 minutes. A polling Lambda burns compute and still needs storage, and .sync only waits for a supported AWS job such as a Batch job or nested execution, not for an email response.",
    reference: "https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token"
  },
  {
    id: 115,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A company processes device events with a Step Functions workflow that runs about 100,000 times per minute. Each execution completes in under 30 seconds, at-least-once execution is acceptable, and cost is the main concern. Which workflow type should the developer choose?",
    selectCount: 1,
    options: [
      { id: "A", text: "Express workflow started asynchronously" },
      { id: "B", text: "Standard workflow" },
      { id: "C", text: "Standard workflow with a Distributed Map state" },
      { id: "D", text: "Express workflow started synchronously through API Gateway" }
    ],
    answers: ["A"],
    explanation: "Express workflows are priced by number of executions and duration rather than per state transition, support very high event rates, and offer at-least-once semantics for asynchronous starts, which matches the requirements. Standard workflows charge per state transition and are designed for long-running, exactly-once work. Distributed Map targets large batch iteration inside one execution. Synchronous Express is for request-response callers that need the result, which adds an unnecessary API layer here.",
    reference: "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"
  },
  {
    id: 116,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "An API Gateway REST API uses Lambda proxy integration. The function executes successfully according to its logs and returns the JSON object it built, but every client receives HTTP 502 with the message Malformed Lambda proxy response. What should the developer change?",
    selectCount: 1,
    options: [
      { id: "A", text: "Return an object with statusCode, an optional headers map, and a body that is a string, for example JSON.stringify of the payload." },
      { id: "B", text: "Increase the integration timeout, because 502 indicates that the function took too long." },
      { id: "C", text: "Enable CORS on the resource so the response can be delivered to the client." },
      { id: "D", text: "Add a mapping template to the integration response to reshape the output." }
    ],
    answers: ["A"],
    explanation: "With proxy integration, API Gateway does not transform the function output. It expects a specific envelope with statusCode, headers, and a string body, and returns 502 when the shape is wrong, most often because body is an object instead of a string. Timeouts produce 504, CORS problems surface as browser errors rather than 502, and mapping templates are ignored by proxy integrations.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format"
  },
  {
    id: 117,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A single-page application on a different domain calls a REST API in API Gateway that uses Lambda proxy integration. The developer used the Enable CORS action in the console, and the preflight OPTIONS request now succeeds, but the browser still blocks the POST response with a CORS error. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "With proxy integration, the Lambda function itself must return the Access-Control-Allow-Origin header on the actual POST response." },
      { id: "B", text: "The API must be redeployed to a stage that has binary media types enabled." },
      { id: "C", text: "The POST method needs an API key because CORS requests require a usage plan." },
      { id: "D", text: "CORS is only supported on HTTP APIs, so the API must be recreated." }
    ],
    answers: ["A"],
    explanation: "Enable CORS in the console configures the OPTIONS preflight with a mock integration and adds headers to method responses, but a proxy integration passes the function response through unchanged. If the function does not include the CORS headers on the real response, the browser rejects it. Binary media types, API keys, and API type are unrelated, and REST APIs fully support CORS.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html"
  },
  {
    id: 118,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A REST API receives a high volume of requests with missing required fields and invalid values in the JSON body. Each bad request currently invokes the backend Lambda function, which returns 400 after validation. The team wants API Gateway to reject these requests before the integration runs, without writing more code. What should the developer configure?",
    selectCount: 1,
    options: [
      { id: "A", text: "A request validator on the method together with a model that defines the JSON schema for the body." },
      { id: "B", text: "A Lambda authorizer that inspects the request body and denies invalid payloads." },
      { id: "C", text: "A mapping template in the integration request that removes invalid fields." },
      { id: "D", text: "A usage plan with a low quota so invalid clients are throttled." }
    ],
    answers: ["A"],
    explanation: "Request validators check required parameters and validate the body against a model's JSON schema, returning 400 without invoking the integration. Lambda authorizers do not receive the request body and are meant for authorization, mapping templates transform rather than reject, and usage plans limit volume regardless of validity.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html"
  },
  {
    id: 119,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A product catalog API backed by Amazon RDS reads far more than it writes. The team adds Amazon ElastiCache and wants to cache only the products that are actually requested, keep memory usage low, and guarantee that a cached product is never older than 5 minutes. Which caching strategy should the developer implement?",
    selectCount: 1,
    options: [
      { id: "A", text: "Lazy loading with a 5 minute TTL on each cached item" },
      { id: "B", text: "Write-through caching without expiration" },
      { id: "C", text: "Preloading the entire catalog into the cache every night" },
      { id: "D", text: "Write-through caching combined with lazy loading and no TTL" }
    ],
    answers: ["A"],
    explanation: "Lazy loading populates the cache only on a cache miss, so only requested products consume memory, and a TTL bounds staleness even when writes bypass the cache. Write-through keeps data fresh but writes every product into the cache whether it is read or not. Nightly preloads violate both the memory goal and the 5 minute freshness bound. Without a TTL, any update that does not pass through the cache path can leave stale data indefinitely.",
    reference: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"
  },
  {
    id: 120,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A gaming company needs a leaderboard that uses Redis sorted sets. The data must be durable across node failures with no loss of acknowledged writes, must survive a full Availability Zone outage, and must remain the primary system of record rather than a cache in front of another database. Which service should the developer choose?",
    selectCount: 1,
    options: [
      { id: "A", text: "Amazon MemoryDB" },
      { id: "B", text: "Amazon ElastiCache for Redis with cluster mode enabled" },
      { id: "C", text: "Amazon ElastiCache for Memcached with multiple nodes" },
      { id: "D", text: "Amazon DynamoDB Accelerator (DAX)" }
    ],
    answers: ["A"],
    explanation: "MemoryDB is Redis-compatible and uses a Multi-AZ transactional log so acknowledged writes are durable, which makes it suitable as a primary database. ElastiCache for Redis replicates asynchronously and can lose recent writes on failover, so AWS positions it as a cache. Memcached has no sorted sets or replication, and DAX only caches DynamoDB.",
    reference: "https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html"
  },
  {
    id: 121,
    domain: "Development with AWS Services",
    type: "single",
    prompt: "A web application runs on Auto Scaling EC2 instances behind an Application Load Balancer with sticky sessions enabled. Users are logged out whenever an instance is replaced during scale-in or deployment. The team wants sessions to survive instance replacement and wants the load balancer to distribute requests evenly. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Store session state in Amazon ElastiCache or DynamoDB, and disable sticky sessions." },
      { id: "B", text: "Increase the stickiness cookie duration to 7 days." },
      { id: "C", text: "Enable connection draining so sessions are copied to the remaining instances." },
      { id: "D", text: "Store session data in the instance's EBS volume and enable EBS snapshots." }
    ],
    answers: ["A"],
    explanation: "Moving session state to a shared store makes the web tier stateless, so any instance can serve any request and instance replacement no longer loses sessions. Longer stickiness only extends the dependence on a single instance and skews load. Deregistration delay lets in-flight requests finish but does not migrate memory, and EBS volumes are local to one instance.",
    reference: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/elasticache-use-cases.html"
  },
  {
    id: 122,
    domain: "Security",
    type: "single",
    prompt: "A developer runs aws lambda create-function with an execution role ARN and receives an AccessDeniedException stating that the user is not authorized to perform iam:PassRole on the role resource. The developer already has lambda:CreateFunction. Which permission is missing?",
    selectCount: 1,
    options: [
      { id: "A", text: "iam:PassRole on the execution role, so the developer may hand that role to the Lambda service" },
      { id: "B", text: "sts:AssumeRole on the execution role, so the developer can act as the role during creation" },
      { id: "C", text: "iam:CreateRole, so Lambda can create a copy of the role in its own account" },
      { id: "D", text: "lambda:AddPermission on the function's resource-based policy" }
    ],
    answers: ["A"],
    explanation: "Passing a role to a service is a privilege in its own right. Without iam:PassRole scoped to that role, a principal could give a service permissions the principal does not have, so IAM blocks it. The developer never assumes the execution role, Lambda does. Creating roles and adding invoke permissions are unrelated to this error.",
    reference: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html"
  },
  {
    id: 123,
    domain: "Security",
    type: "single",
    prompt: "An application on an EC2 instance uses an instance profile. The team notices that SDK calls are being signed with an IAM user's access key that was revoked last week, and requests now fail with InvalidClientTokenId. The instance profile role is healthy. What is the most likely reason?",
    selectCount: 1,
    options: [
      { id: "A", text: "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are set in the process, and the SDK credential chain checks them before the instance metadata service." },
      { id: "B", text: "The instance profile role's maximum session duration has expired and must be refreshed by rebooting." },
      { id: "C", text: "IMDSv2 is enforced, so the SDK falls back to the last credentials it cached on disk." },
      { id: "D", text: "The role's trust policy does not list the EC2 service principal." }
    ],
    answers: ["A"],
    explanation: "SDKs and the CLI walk a credential provider chain and stop at the first source that yields credentials. Environment variables and shared config files come before container and instance metadata credentials, so stale keys in the environment override the instance profile. Instance profile credentials rotate automatically, SDKs support IMDSv2 natively, and a broken trust policy would prevent the role from working at all rather than substituting other keys.",
    reference: "https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html"
  },
  {
    id: 124,
    domain: "Security",
    type: "single",
    prompt: "A mobile application lets users sign in with Google and then upload files directly to Amazon S3 with temporary credentials. The company does not want to run Amazon Cognito and will exchange the Google ID token itself. Which AWS STS API should the app call?",
    selectCount: 1,
    options: [
      { id: "A", text: "AssumeRoleWithWebIdentity" },
      { id: "B", text: "AssumeRoleWithSAML" },
      { id: "C", text: "GetSessionToken" },
      { id: "D", text: "GetFederationToken" }
    ],
    answers: ["A"],
    explanation: "AssumeRoleWithWebIdentity accepts an OpenID Connect token from providers such as Google or Amazon and returns temporary credentials for a role that trusts that provider, without needing AWS credentials to call it. AssumeRoleWithSAML is for SAML assertions from enterprise identity providers. GetSessionToken and GetFederationToken must be called with long-term IAM user credentials, which a mobile app must never embed.",
    reference: "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html"
  },
  {
    id: 125,
    domain: "Security",
    type: "single",
    prompt: "A company's S3 bucket policy denies s3:DeleteObject unless aws:MultiFactorAuthPresent is true. An operations engineer with an IAM user and a virtual MFA device must run a cleanup script from a workstation that deletes objects, without assuming a different role. How should the script obtain credentials?",
    selectCount: 1,
    options: [
      { id: "A", text: "Call GetSessionToken with the MFA device serial number and current code, then use the returned temporary credentials." },
      { id: "B", text: "Call GetFederationToken with the user's long-term keys and the bucket policy attached inline." },
      { id: "C", text: "Add the MFA device ARN to the IAM user's permissions policy as a condition." },
      { id: "D", text: "Sign requests with SigV4 using the long-term access key, because MFA is validated at sign-in." }
    ],
    answers: ["A"],
    explanation: "Long-term access keys carry no MFA context, so requests signed with them fail the aws:MultiFactorAuthPresent condition. GetSessionToken with an MFA serial and code returns temporary credentials that carry the MFA claim. GetFederationToken cannot include MFA, and MFA presence is a property of the credentials used in the request, not something a permissions policy can assert.",
    reference: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html"
  },
  {
    id: 126,
    domain: "Security",
    type: "single",
    prompt: "A web application authenticates users with an Amazon Cognito user pool that has Admins and Viewers groups. Both groups obtain AWS credentials through a Cognito identity pool to access S3 directly. Admins must be able to write to a bucket, while Viewers must only read from it. What is the most maintainable way to enforce this?",
    selectCount: 1,
    options: [
      { id: "A", text: "Assign an IAM role to each user pool group and configure the identity pool's authenticated role selection to choose the role from the token." },
      { id: "B", text: "Create two identity pools, one per group, each with its own authenticated role." },
      { id: "C", text: "Give both groups the same role and enforce the difference with a Lambda authorizer in front of S3." },
      { id: "D", text: "Store the group name in a custom attribute and have the client select which role to assume." }
    ],
    answers: ["A"],
    explanation: "User pool groups can carry an IAM role ARN, and the identity pool can be configured to select the role from the cognito:preferred_role claim in the ID token. That gives per-group permissions from one identity pool with no client-side trust. Separate identity pools duplicate configuration, S3 has no authorizer hook, and letting the client choose a role is not a security control.",
    reference: "https://docs.aws.amazon.com/cognito/latest/developerguide/role-based-access-control.html"
  },
  {
    id: 127,
    domain: "Security",
    type: "single",
    prompt: "A REST API in API Gateway must accept JWTs issued by a corporate Okta tenant, verify them, enforce a scope claim per route, and cache authorization decisions to reduce latency. Which authorizer type should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "A Lambda authorizer of type TOKEN with result caching enabled" },
      { id: "B", text: "An Amazon Cognito user pool authorizer" },
      { id: "C", text: "IAM authorization with SigV4-signed requests" },
      { id: "D", text: "An API key with a usage plan" }
    ],
    answers: ["A"],
    explanation: "For REST APIs, a Lambda authorizer can validate any third-party JWT, apply custom claim logic, and return an IAM policy that API Gateway caches for the configured TTL. Cognito authorizers on REST APIs only validate tokens issued by Cognito user pools. IAM authorization requires AWS credentials and SigV4, and API keys identify clients for throttling rather than authenticating users.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html"
  },
  {
    id: 128,
    domain: "Security",
    type: "single",
    prompt: "An application reads a tenantId claim from the Cognito ID token to scope database queries. The value is stored in a separate tenant table rather than on the user record, and it must be present in the token at sign-in without a second API call. Which Cognito user pool Lambda trigger should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Pre token generation" },
      { id: "B", text: "Post confirmation" },
      { id: "C", text: "Pre sign-up" },
      { id: "D", text: "Custom message" }
    ],
    answers: ["A"],
    explanation: "The pre token generation trigger runs before Cognito issues tokens and lets code add, suppress, or override claims, which is exactly what is needed to inject a looked-up tenantId. Post confirmation runs once after sign-up confirmation, pre sign-up controls registration, and custom message customizes emails and SMS.",
    reference: "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html"
  },
  {
    id: 129,
    domain: "Security",
    type: "single",
    prompt: "An upload service writes objects to S3 with the header x-amz-server-side-encryption set to aws:kms and a customer managed key. A reporting role in the same account has s3:GetObject on the bucket, and the bucket policy grants it read access, but its GetObject calls fail with AccessDenied. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "The reporting role does not have kms:Decrypt permission for the customer managed key." },
      { id: "B", text: "The reporting role needs s3:GetObjectVersion because SSE-KMS objects are always versioned." },
      { id: "C", text: "S3 Bucket Keys are disabled, so cross-role reads are rejected." },
      { id: "D", text: "The key is a single-Region key and the reporting role runs in another Region." }
    ],
    answers: ["A"],
    explanation: "Reading an SSE-KMS object requires S3 to call KMS on the caller's behalf, so the reader needs kms:Decrypt on the key through the key policy or an IAM policy the key policy permits. S3 permissions alone are not enough. Versioning is unrelated to encryption, Bucket Keys only reduce KMS request volume, and the key Region matters for the bucket, not for who reads.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"
  },
  {
    id: 130,
    domain: "Security",
    type: "single",
    prompt: "A data pipeline writes millions of small objects per hour to an S3 bucket with SSE-KMS and a customer managed key, and PutObject calls have started failing with KMS ThrottlingException. The security team requires the customer managed key to remain in use. What is the best fix?",
    selectCount: 1,
    options: [
      { id: "A", text: "Enable S3 Bucket Keys on the bucket so S3 uses a bucket-level data key and makes far fewer KMS requests." },
      { id: "B", text: "Switch the bucket to SSE-S3 so no KMS requests are made." },
      { id: "C", text: "Create a KMS key per prefix so each key has its own quota." },
      { id: "D", text: "Enable automatic key rotation to refresh the KMS request quota." }
    ],
    answers: ["A"],
    explanation: "With an S3 Bucket Key, S3 requests one bucket-level key from KMS and derives per-object keys locally, cutting KMS traffic by up to 99 percent while still using the customer managed key. SSE-S3 violates the requirement. The KMS request quota is per account per Region, not per key, so more keys do not help, and rotation has nothing to do with request rates.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html"
  },
  {
    id: 131,
    domain: "Security",
    type: "single",
    prompt: "A compliance rule states that every object written to a bucket must be encrypted with SSE-KMS using the company key, and uploads that explicitly request SSE-S3 must be rejected. The bucket already has default encryption set to the company KMS key. Why are SSE-S3 uploads still succeeding, and what should the developer add?",
    selectCount: 1,
    options: [
      { id: "A", text: "Default encryption only applies when a request specifies no encryption; add a bucket policy that denies s3:PutObject when s3:x-amz-server-side-encryption is not aws:kms." },
      { id: "B", text: "Default encryption is not applied until versioning is enabled; enable versioning on the bucket." },
      { id: "C", text: "The uploader's IAM policy overrides the bucket setting; remove s3:PutObject from the uploader." },
      { id: "D", text: "S3 always accepts SSE-S3; enable S3 Object Lock in compliance mode." }
    ],
    answers: ["A"],
    explanation: "Bucket default encryption fills in encryption when a request does not ask for any, but it does not override a request that explicitly chooses SSE-S3. Enforcement requires a bucket policy deny with a condition on the s3:x-amz-server-side-encryption key, typically paired with a second statement for the key ID. Versioning, uploader permissions, and Object Lock do not control the encryption method.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html"
  },
  {
    id: 132,
    domain: "Security",
    type: "single",
    prompt: "A regulated customer requires that AWS never stores the encryption key used for their objects in Amazon S3, even in a hardware security module, and that their application supplies the key material on every upload and download. Which server-side encryption option meets this requirement?",
    selectCount: 1,
    options: [
      { id: "A", text: "SSE-C with the key sent in request headers over HTTPS" },
      { id: "B", text: "SSE-KMS with imported key material" },
      { id: "C", text: "SSE-S3" },
      { id: "D", text: "SSE-KMS with a multi-Region key" }
    ],
    answers: ["A"],
    explanation: "With SSE-C the client provides the key on each request, S3 uses it in memory and stores only a salted HMAC to validate later requests, and the key itself is never persisted. Imported key material still lives inside KMS, and SSE-S3 keys are fully managed by AWS.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html"
  },
  {
    id: 133,
    domain: "Security",
    type: "multiple",
    prompt: "Account A owns a customer managed KMS key that encrypts objects in an S3 bucket in Account A. An IAM role in Account B must read those objects. The bucket policy already grants the role in Account B s3:GetObject. Which TWO additional configurations are required? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "The key policy in Account A must allow the Account B role or account to use kms:Decrypt." },
      { id: "B", text: "An IAM policy attached to the role in Account B must allow kms:Decrypt on the key ARN in Account A." },
      { id: "C", text: "The key must be replicated to Account B as a multi-Region key." },
      { id: "D", text: "Automatic key rotation must be enabled so the cross-account grant is refreshed." },
      { id: "E", text: "A key alias must be created in Account B that points to the key in Account A." }
    ],
    answers: ["A", "B"],
    explanation: "Cross-account KMS use needs permission on both sides: the key policy in the owning account must permit the external principal, and the external principal's own IAM policy must allow the action on that key. Multi-Region keys are for cross-Region use, not cross-account, rotation does not touch permissions, and aliases are account-local names that grant nothing.",
    reference: "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html"
  },
  {
    id: 134,
    domain: "Security",
    type: "single",
    prompt: "A company sends webhooks to hundreds of partners. Partners must be able to verify that each webhook was produced by the company, and the company refuses to distribute any secret to partners. Which approach should the developer implement?",
    selectCount: 1,
    options: [
      { id: "A", text: "Sign each payload with an asymmetric KMS key using the Sign API, and publish the public key so partners can verify signatures locally." },
      { id: "B", text: "Compute an HMAC with a symmetric KMS key using GenerateMac and share the key with partners." },
      { id: "C", text: "Store a shared secret in AWS Secrets Manager and grant partners cross-account read access." },
      { id: "D", text: "Encrypt each payload with a symmetric KMS key so only partners with kms:Decrypt can read it." }
    ],
    answers: ["A"],
    explanation: "Asymmetric signing keeps the private key inside KMS while anyone with the public key can verify authenticity, so no secret leaves the company. HMAC verification requires the shared key, which is exactly what the company will not distribute. Sharing secrets through Secrets Manager still distributes a secret, and encryption provides confidentiality rather than proof of origin.",
    reference: "https://docs.aws.amazon.com/kms/latest/developerguide/asymmetric-key-specs.html"
  },
  {
    id: 135,
    domain: "Security",
    type: "single",
    prompt: "A Lambda function generates presigned S3 URLs for report downloads and requests a 7 day expiry. Customers report that links stop working after about an hour with an ExpiredToken error, well before the requested expiry. What explains this?",
    selectCount: 1,
    options: [
      { id: "A", text: "A presigned URL is only valid while the credentials that signed it are valid, and the function's execution role credentials are temporary and expire." },
      { id: "B", text: "Presigned URLs cannot exceed 1 hour when the object is encrypted with SSE-KMS." },
      { id: "C", text: "The bucket's lifecycle rule transitions reports to Glacier after 1 hour, invalidating the URL." },
      { id: "D", text: "The Lambda function timeout also caps the lifetime of any URL it signs." }
    ],
    answers: ["A"],
    explanation: "A presigned URL is a signed request, so it dies when the signing credentials do. Role credentials in Lambda are temporary, so URLs signed with them expire when that session ends regardless of the requested duration. Long-lived presigned URLs require credentials that outlast the URL, such as an IAM user access key, or the design must regenerate URLs on demand with a shorter expiry. The other options describe rules that do not exist.",
    reference: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#PresignedUrl-Expiration"
  },
  {
    id: 136,
    domain: "Security",
    type: "single",
    prompt: "A team enabled automatic rotation on an AWS Secrets Manager secret for an Amazon RDS database that sits in private subnets. The rotation Lambda function was placed in the same private subnets so it can reach the database, but every rotation now fails and the function logs show timeouts calling secretsmanager.<region>.amazonaws.com. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Create an interface VPC endpoint for Secrets Manager in the VPC, or give the subnets a NAT route, so the rotation function can reach the Secrets Manager API." },
      { id: "B", text: "Grant the database instance permission to call secretsmanager:RotateSecret." },
      { id: "C", text: "Increase the rotation interval so the function has more time to connect." },
      { id: "D", text: "Move the secret to Parameter Store, which does not require network access for rotation." }
    ],
    answers: ["A"],
    explanation: "The rotation function must reach two things: the database inside the VPC and the public Secrets Manager API. A function in private subnets without a NAT route or a VPC endpoint cannot reach the API, so rotation times out. Databases do not call Secrets Manager, rotation interval does not affect connectivity, and Parameter Store has no native rotation.",
    reference: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotation-network-rqmts.html"
  },
  {
    id: 137,
    domain: "Security",
    type: "multiple",
    prompt: "A containerized service loads about 30 configuration values from AWS Systems Manager Parameter Store under the path /prod/orders/ at startup. Some values are database credentials. During deployments many tasks start at once and the service receives ThrottlingException from Parameter Store, and the security team wants the credentials encrypted at rest. Which TWO actions should the developer take? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Replace the individual GetParameter calls with GetParametersByPath for /prod/orders/ so each task makes one or two calls instead of 30." },
      { id: "B", text: "Store the credential parameters as SecureString parameters backed by a KMS key and request them with WithDecryption." },
      { id: "C", text: "Store the credentials as String parameters and encrypt the values in application code before writing them." },
      { id: "D", text: "Retry each GetParameter call immediately without delay until it succeeds." },
      { id: "E", text: "Put all 30 values into one String parameter as a comma-separated list to avoid the hierarchy." }
    ],
    answers: ["A", "B"],
    explanation: "GetParametersByPath returns a whole hierarchy in a few paginated calls, which drastically reduces request volume during startup storms. SecureString parameters use KMS to encrypt at rest and decrypt on read with proper IAM and KMS permissions. Home-grown encryption of String parameters and flattening everything into one value lose the security and structure benefits, and tight retries make throttling worse.",
    reference: "https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-securestring.html"
  },
  {
    id: 138,
    domain: "Security",
    type: "single",
    prompt: "An audit finds that application logs in CloudWatch Logs contain customer email addresses and credit card numbers inside request payloads that were logged for debugging. The company wants sensitive values masked for everyone who views the logs, with an audit trail of detections, and must not lose the rest of the log content. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Attach a CloudWatch Logs data protection policy to the log group that detects and masks the sensitive data identifiers." },
      { id: "B", text: "Encrypt the log group with a customer managed KMS key." },
      { id: "C", text: "Reduce the log group retention to one day so sensitive data ages out quickly." },
      { id: "D", text: "Export the logs to S3 and enable S3 Block Public Access." }
    ],
    answers: ["A"],
    explanation: "Data protection policies scan ingested log events for managed identifiers such as email addresses and card numbers, mask them in the stored events for users without the unmask permission, and emit audit findings. KMS encryption protects data at rest but shows plaintext to anyone with read access, shorter retention still exposes data while it exists, and S3 access settings do not remove the values.",
    reference: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html"
  },
  {
    id: 139,
    domain: "Deployment",
    type: "single",
    prompt: "A platform team maintains a CloudFormation stack that creates a VPC and subnets. Several application stacks in the same account and Region need the subnet IDs. The platform team also wants CloudFormation to block deletion of the network stack while any application stack still depends on it. What should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "Outputs with Export in the network stack and Fn::ImportValue in the application stacks" },
      { id: "B", text: "Nested stacks with the network stack as the parent of every application stack" },
      { id: "C", text: "Parameters in each application stack that operators fill in from the console" },
      { id: "D", text: "Dynamic references to SSM parameters that the network stack writes" }
    ],
    answers: ["A"],
    explanation: "Exported outputs create tracked cross-stack references, and CloudFormation refuses to delete or modify a stack whose exports are still imported by another stack. Nested stacks force a single lifecycle and a parent-child ownership model that does not fit independent application teams. Manual parameters and SSM dynamic references both work for passing values but provide no deletion protection.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html"
  },
  {
    id: 140,
    domain: "Deployment",
    type: "single",
    prompt: "A CloudFormation template creates an Amazon RDS instance. The security team forbids the database master password from appearing in the template, in stack parameters, or in the deployment logs, and wants the password to be managed in AWS Secrets Manager. How should the developer supply the password?",
    selectCount: 1,
    options: [
      { id: "A", text: "Reference the secret with a dynamic reference such as {{resolve:secretsmanager:prod/db:SecretString:password}} in the MasterUserPassword property." },
      { id: "B", text: "Declare a Parameter with NoEcho set to true and pass the password at deploy time." },
      { id: "C", text: "Store the password in the template Mappings section and reference it with Fn::FindInMap." },
      { id: "D", text: "Encrypt the password with KMS and paste the ciphertext into the template, since RDS decrypts it automatically." }
    ],
    answers: ["A"],
    explanation: "Dynamic references let CloudFormation fetch the value from Secrets Manager at deployment time, so the password never appears in the template, parameters, or events. NoEcho hides the value in console output but the operator still supplies and transmits the plaintext. Mappings are plaintext in the template, and RDS does not decrypt KMS ciphertext passed as a password.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html"
  },
  {
    id: 141,
    domain: "Deployment",
    type: "single",
    prompt: "A CloudFormation stack update failed and the automatic rollback also failed, leaving the stack in UPDATE_ROLLBACK_FAILED. An engineer had manually deleted a security group that the template still manages. The team must get the stack back to a healthy state without deleting it. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Run ContinueUpdateRollback, skipping the resource that can no longer be rolled back, then fix the template and update the stack." },
      { id: "B", text: "Delete the stack and recreate it from the last known good template." },
      { id: "C", text: "Run drift detection so CloudFormation reconciles the missing resource automatically." },
      { id: "D", text: "Create and execute a new change set that recreates the security group." }
    ],
    answers: ["A"],
    explanation: "UPDATE_ROLLBACK_FAILED blocks further updates until the rollback completes. ContinueUpdateRollback retries the rollback, and its ResourcesToSkip option lets CloudFormation mark resources that were changed outside of it as rolled back so the stack reaches UPDATE_ROLLBACK_COMPLETE. Deleting the stack violates the requirement, drift detection only reports differences, and change sets cannot be executed while the stack is in this state.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html#troubleshooting-errors-update-rollback-failed"
  },
  {
    id: 142,
    domain: "Deployment",
    type: "single",
    prompt: "A single CloudFormation template is deployed in four AWS Regions. Each Region requires a different AMI ID for the same application image. The team wants to keep one template and avoid asking operators to look up the ID at deploy time. Which template feature should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "A Mappings section keyed by Region, looked up with Fn::FindInMap and the AWS::Region pseudo parameter" },
      { id: "B", text: "A Conditions section with Fn::If for each Region" },
      { id: "C", text: "A Parameter with AllowedValues listing the four AMI IDs" },
      { id: "D", text: "Fn::GetAtt on the EC2 instance to read its image ID after creation" }
    ],
    answers: ["A"],
    explanation: "Mappings are static lookup tables designed for exactly this case, and AWS::Region selects the correct row automatically. Conditions can express per-Region logic but become verbose and still need a value source. A parameter still requires the operator to choose, and GetAtt reads attributes after creation rather than supplying inputs.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html"
  },
  {
    id: 143,
    domain: "Deployment",
    type: "single",
    prompt: "A CloudFormation template launches an EC2 instance whose user data installs and starts a web application, which takes about 6 minutes. The stack reaches CREATE_COMPLETE after 1 minute, and a downstream pipeline stage that runs smoke tests immediately fails. The team wants stack creation to succeed only once the application reports that it is ready. What should the developer add?",
    selectCount: 1,
    options: [
      { id: "A", text: "A CreationPolicy on the instance with a timeout, and a cfn-signal call at the end of the user data script." },
      { id: "B", text: "A DependsOn attribute from the instance to the security group." },
      { id: "C", text: "A DeletionPolicy of Retain so the instance survives the failed test." },
      { id: "D", text: "An UpdatePolicy with a longer PauseTime." }
    ],
    answers: ["A"],
    explanation: "CreationPolicy makes CloudFormation wait for the specified number of success signals before marking the resource complete, and cfn-signal sends that signal from the instance when bootstrapping finishes. DependsOn only orders creation between resources, DeletionPolicy affects deletion, and UpdatePolicy governs Auto Scaling group updates rather than initial creation.",
    reference: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html"
  },
  {
    id: 144,
    domain: "Deployment",
    type: "multiple",
    prompt: "A team deploys a Lambda function with AWS SAM and wants every deployment to shift 10 percent of traffic to the new version, wait 5 minutes, roll back automatically if an error-rate alarm fires, and then shift the rest. Which TWO properties must the developer add to the AWS::Serverless::Function resource? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "AutoPublishAlias with an alias name such as live" },
      { id: "B", text: "DeploymentPreference with Type Canary10Percent5Minutes and the alarm listed under Alarms" },
      { id: "C", text: "ProvisionedConcurrencyConfig with ProvisionedConcurrentExecutions of 10" },
      { id: "D", text: "ReservedConcurrentExecutions of 10" },
      { id: "E", text: "A Globals section that sets Timeout to 300" }
    ],
    answers: ["A", "B"],
    explanation: "SAM implements gradual deployments through CodeDeploy, which shifts traffic between Lambda versions behind an alias, so AutoPublishAlias is required, and DeploymentPreference selects the shifting type, alarms, and hooks. Concurrency settings and the Globals timeout have nothing to do with traffic shifting.",
    reference: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/automating-updates-to-serverless-apps.html"
  },
  {
    id: 145,
    domain: "Deployment",
    type: "single",
    prompt: "A SAM template defines a Lambda function that must create, read, update, and delete items in one DynamoDB table named Orders, and nothing else. The developer wants the least-privilege policy with the least template code. What should the developer add to the function's Policies property?",
    selectCount: 1,
    options: [
      { id: "A", text: "The DynamoDBCrudPolicy SAM policy template with TableName set to the Orders table" },
      { id: "B", text: "The AmazonDynamoDBFullAccess managed policy ARN" },
      { id: "C", text: "An inline statement allowing dynamodb:* on Resource *" },
      { id: "D", text: "Nothing, because SAM grants table access automatically when the table is in the same template" }
    ],
    answers: ["A"],
    explanation: "SAM policy templates expand into scoped IAM statements for one resource, so DynamoDBCrudPolicy grants exactly the item-level actions on the named table. Managed full-access policies and wildcards violate least privilege, and SAM does not infer permissions from resources in the same template except through explicit connectors or policies.",
    reference: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html"
  },
  {
    id: 146,
    domain: "Deployment",
    type: "single",
    prompt: "A Lambda function is deployed with CodeDeploy using linear traffic shifting. Before any production traffic reaches the new version, an automated smoke test must run against it and abort the deployment if the test fails. Where should the developer reference the test function in the AppSpec file?",
    selectCount: 1,
    options: [
      { id: "A", text: "In the BeforeAllowTraffic hook" },
      { id: "B", text: "In the AfterAllowTraffic hook" },
      { id: "C", text: "In the ValidateService hook" },
      { id: "D", text: "In the AfterInstall hook" }
    ],
    answers: ["A"],
    explanation: "Lambda deployments support two lifecycle hooks: BeforeAllowTraffic runs before traffic shifting starts and AfterAllowTraffic runs after it finishes. A test that must gate the first traffic shift belongs in BeforeAllowTraffic, and it signals failure with PutLifecycleEventHookExecutionStatus. ValidateService and AfterInstall are EC2 and ECS hooks and are not valid for Lambda AppSpec files.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#appspec-hooks-lambda"
  },
  {
    id: 147,
    domain: "Deployment",
    type: "multiple",
    prompt: "An in-place CodeDeploy deployment to EC2 instances must stop the currently running application process before the new revision files are copied, and must run a database migration script after the files are copied but before the new process starts. Which TWO AppSpec lifecycle hooks should the developer use? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "ApplicationStop for stopping the running process" },
      { id: "B", text: "AfterInstall for the migration script" },
      { id: "C", text: "BeforeInstall for the migration script" },
      { id: "D", text: "ValidateService for stopping the running process" },
      { id: "E", text: "DownloadBundle for the migration script" }
    ],
    answers: ["A", "B"],
    explanation: "The EC2 lifecycle runs ApplicationStop, DownloadBundle, BeforeInstall, Install, AfterInstall, ApplicationStart, and ValidateService in that order. ApplicationStop is the hook for gracefully stopping the old process, and AfterInstall runs once the revision files are in place but before ApplicationStart, which is the right point for a migration. BeforeInstall runs before the files exist, ValidateService runs last, and DownloadBundle cannot run scripts.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#reference-appspec-file-structure-hooks-availability"
  },
  {
    id: 148,
    domain: "Deployment",
    type: "multiple",
    prompt: "A team runs a service on Amazon ECS with Fargate behind an Application Load Balancer and wants blue/green deployments managed by CodeDeploy so a new task set can be tested on a separate port before production traffic is shifted. Which TWO configurations are required? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Two target groups on the load balancer, one for the blue task set and one for the green task set." },
      { id: "B", text: "The ECS service created with the CODE_DEPLOY deployment controller." },
      { id: "C", text: "The ECS deployment circuit breaker with rollback enabled." },
      { id: "D", text: "A capacity provider strategy that uses FARGATE_SPOT for the green task set." },
      { id: "E", text: "Service discovery with a Route 53 private hosted zone." }
    ],
    answers: ["A", "B"],
    explanation: "CodeDeploy blue/green for ECS swaps listener rules between two target groups, optionally exposing the green target group on a test listener first, and it only works on services whose deployment controller is CODE_DEPLOY. The circuit breaker belongs to ECS rolling updates, capacity providers affect placement rather than deployment style, and service discovery is unrelated.",
    reference: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html"
  },
  {
    id: 149,
    domain: "Deployment",
    type: "single",
    prompt: "An Elastic Beanstalk environment runs a web application on 8 instances. The team requires that no instance ever runs old and new versions side by side, that full capacity is maintained throughout the deployment, and that a failed deployment leaves the original instances untouched so rollback is just termination of the new fleet. Extra instance cost during deployment is acceptable. Which deployment policy should the developer choose?",
    selectCount: 1,
    options: [
      { id: "A", text: "Immutable" },
      { id: "B", text: "Rolling with additional batch" },
      { id: "C", text: "Rolling" },
      { id: "D", text: "All at once" }
    ],
    answers: ["A"],
    explanation: "Immutable deployments launch a full new fleet in a temporary Auto Scaling group, verify health, and only then swap it in, so original instances are never modified and rollback is a clean termination. Rolling with additional batch keeps capacity but updates existing instances in place, so a failure leaves a mixed fleet. Rolling reduces capacity during batches, and all at once causes downtime.",
    reference: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html"
  },
  {
    id: 150,
    domain: "Deployment",
    type: "single",
    prompt: "An Elastic Beanstalk application needs an operating system package installed on every instance, a custom environment variable set, and a CloudWatch alarm created as part of the environment. The team wants these to be versioned with the source bundle rather than configured by hand. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Add .config files under an .ebextensions directory in the source bundle that declare packages, option_settings, and a Resources section for the alarm." },
      { id: "B", text: "Create a custom AMI with the package, and set the variable and alarm manually in the console after each deployment." },
      { id: "C", text: "Add the commands to a cron.yaml file so the worker tier runs them at startup." },
      { id: "D", text: "Place the settings in Dockerrun.aws.json so the platform applies them to every instance." }
    ],
    answers: ["A"],
    explanation: "The .ebextensions mechanism lets a source bundle customize instances and the environment through packages, files, commands, option_settings, and even raw CloudFormation resources such as alarms. A custom AMI only covers the package and leaves the rest manual, cron.yaml schedules periodic tasks for worker environments, and Dockerrun.aws.json describes containers rather than environment resources.",
    reference: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html"
  },
  {
    id: 151,
    domain: "Deployment",
    type: "single",
    prompt: "A CodePipeline pipeline has a manual approval action before the production deploy stage. Compliance requires that only members of the ReleaseManagers IAM group can approve or reject, while all developers keep permission to view the pipeline and start executions. How should the developer enforce this?",
    selectCount: 1,
    options: [
      { id: "A", text: "Allow codepipeline:PutApprovalResult on the specific pipeline, stage, and action ARN only in the ReleaseManagers group policy, and omit or deny it for developers." },
      { id: "B", text: "Restrict the SNS topic subscription for the approval notification to release managers." },
      { id: "C", text: "Configure the approval action's external entity link to an internal page that only release managers can open." },
      { id: "D", text: "Change the pipeline service role so it can only be assumed by release managers." }
    ],
    answers: ["A"],
    explanation: "Approval is an IAM-controlled API call, and the resource ARN can be scoped down to a single approval action, so the group policy is the correct enforcement point. The SNS topic only sends notifications and does not gate the action, the external link is informational, and the pipeline service role is assumed by CodePipeline itself rather than by people.",
    reference: "https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals-iam-permissions.html"
  },
  {
    id: 152,
    domain: "Deployment",
    type: "single",
    prompt: "A CodeBuild project builds a Docker image and pushes it to Amazon ECR. The build fails during the docker build command with the error Cannot connect to the Docker daemon. The buildspec and Dockerfile work on a developer laptop. What should the developer change in the CodeBuild project?",
    selectCount: 1,
    options: [
      { id: "A", text: "Enable privileged mode in the project's environment settings so the build container can run the Docker daemon." },
      { id: "B", text: "Increase the compute type to a larger instance so Docker has enough memory." },
      { id: "C", text: "Add docker to the runtime-versions list in the install phase." },
      { id: "D", text: "Run the build inside a VPC so the Docker daemon can reach ECR." }
    ],
    answers: ["A"],
    explanation: "Building images inside CodeBuild requires a Docker daemon in the build container, which is only started when privileged mode is enabled. Compute size and VPC settings do not start the daemon, and while docker can be listed under runtime-versions on some images, the daemon still will not run without privileged mode.",
    reference: "https://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html"
  },
  {
    id: 153,
    domain: "Deployment",
    type: "multiple",
    prompt: "A team defines its infrastructure with the AWS CDK in TypeScript. Before each deployment they want to see exactly which resources will be added, changed, or removed, and in CI they want unit tests that fail if a stack ever synthesizes an S3 bucket without encryption. Which TWO tools should the developer use? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "The cdk diff command to compare the synthesized template with the deployed stack." },
      { id: "B", text: "The assertions module from aws-cdk-lib to write tests that inspect the synthesized template's resource properties." },
      { id: "C", text: "The cdk bootstrap command, which validates templates against account policies." },
      { id: "D", text: "CloudFormation drift detection run after each deployment." },
      { id: "E", text: "The cdk destroy command with the --dry-run flag." }
    ],
    answers: ["A", "B"],
    explanation: "cdk diff shows the resource-level changes a deployment would make, and the assertions module lets tests synthesize a stack and assert on template contents such as bucket encryption properties. Bootstrap provisions the deployment resources CDK needs, drift detection compares live resources with a deployed template rather than gating a change, and destroy has no dry-run mode.",
    reference: "https://docs.aws.amazon.com/cdk/v2/guide/testing.html"
  },
  {
    id: 154,
    domain: "Deployment",
    type: "single",
    prompt: "A REST API in API Gateway is served from a prod stage that clients call directly by URL. The team wants to send 10 percent of production requests to a new deployment of the API for an hour, watch its metrics and logs separately, and then either promote or abandon it without changing client URLs. Which API Gateway feature should the developer use?",
    selectCount: 1,
    options: [
      { id: "A", text: "A canary release on the prod stage that points at the new deployment with a 10 percent traffic percentage" },
      { id: "B", text: "A second stage named prod-next with a custom domain and weighted DNS records" },
      { id: "C", text: "A usage plan that limits 10 percent of API keys to the new deployment" },
      { id: "D", text: "Stage variables that route 10 percent of requests to a different Lambda alias" }
    ],
    answers: ["A"],
    explanation: "Canary release settings on a stage direct a configurable percentage of requests to a separate canary deployment, keep canary metrics and logs distinct, and allow promotion or deletion in place. A second stage needs client or DNS changes and does not split within one URL. Usage plans do not route traffic, and stage variables set static values rather than percentages.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html"
  },
  {
    id: 155,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A report-generation endpoint on an edge-optimized REST API in API Gateway invokes a Lambda function that takes about 45 seconds. Clients receive HTTP 504 after roughly 29 seconds even though the function later completes successfully. The Lambda timeout is already 60 seconds. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Change the endpoint to accept the request, return 202 with a job ID, process the report asynchronously, and let the client poll or be notified when it is ready." },
      { id: "B", text: "Increase the Lambda function timeout to 120 seconds." },
      { id: "C", text: "Enable API Gateway caching on the endpoint so repeated requests return immediately." },
      { id: "D", text: "Enable Provisioned Concurrency so the function starts faster." }
    ],
    answers: ["A"],
    explanation: "The 504 is API Gateway's integration timeout, which defaults to 29 seconds, so the function's own timeout is irrelevant. Regional and private REST APIs can request a higher integration timeout quota, but edge-optimized APIs cannot, so the durable fix is an asynchronous pattern that decouples the long task from the HTTP request. Caching only helps repeated identical requests, and Provisioned Concurrency removes cold starts, not 45 seconds of work.",
    reference: "https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html"
  },
  {
    id: 156,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A service writes JSON log lines to CloudWatch Logs with fields such as status, path, and latencyMs. During an incident, the on-call engineer needs a count of server errors grouped by path from the last hour. Which CloudWatch Logs Insights query returns that?",
    selectCount: 1,
    options: [
      { id: "A", text: "filter status >= 500 | stats count(*) by path | sort count desc" },
      { id: "B", text: "parse @message \"status=*\" as status | stats sum(status) by path" },
      { id: "C", text: "fields @timestamp, path | filter path like /5\\d\\d/ | limit 100" },
      { id: "D", text: "stats avg(latencyMs) by status | filter status >= 500" }
    ],
    answers: ["A"],
    explanation: "Logs Insights automatically discovers fields in JSON events, so status and path can be filtered and aggregated directly. Option A filters to 5xx responses, counts per path, and sorts the result. Option B parses a pattern that does not match JSON and sums status codes, which is meaningless. Option C applies the 5xx pattern to the path field and returns raw events, and option D averages latency instead of counting errors.",
    reference: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html"
  },
  {
    id: 157,
    domain: "Troubleshooting and Optimization",
    type: "multiple",
    prompt: "A developer instruments a Node.js service running on Amazon ECS with Fargate using the X-Ray SDK. The code creates segments, but nothing appears in the X-Ray console, and the application logs show that segments could not be sent to 127.0.0.1:2000. Which TWO changes are required? Select TWO.",
    selectCount: 2,
    options: [
      { id: "A", text: "Add the X-Ray daemon as a sidecar container in the task definition and point AWS_XRAY_DAEMON_ADDRESS at it." },
      { id: "B", text: "Grant the task IAM role permission for xray:PutTraceSegments and xray:PutTelemetryRecords." },
      { id: "C", text: "Enable CloudTrail data events for the X-Ray service." },
      { id: "D", text: "Set the sampling rate to 100 percent so at least some traces are captured." },
      { id: "E", text: "Add X-Ray annotations to every segment so the console can index them." }
    ],
    answers: ["A", "B"],
    explanation: "The X-Ray SDK does not talk to the X-Ray API directly. It sends UDP segment data to a daemon, which on ECS must run as a sidecar or on the host, and the daemon uploads segments using the task role, which needs the write permissions. CloudTrail data events, sampling percentage, and annotations do not affect whether segments reach the service.",
    reference: "https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-ecs.html"
  },
  {
    id: 158,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A high-traffic API traced with X-Ray is generating expensive volumes of trace data. The team wants to keep the default low sampling for most routes but capture every request to the /checkout path so payment problems can always be investigated. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Create an X-Ray sampling rule that matches the /checkout URL path with a fixed rate of 100 percent and higher priority, and keep the default rule for everything else." },
      { id: "B", text: "Set AWS_XRAY_CONTEXT_MISSING to LOG_ERROR so only failing requests are traced." },
      { id: "C", text: "Record the path as metadata so filter expressions can find checkout traces later." },
      { id: "D", text: "Disable active tracing on every function except the checkout function." }
    ],
    answers: ["A"],
    explanation: "Sampling rules are evaluated by priority and can match on service, host, HTTP method, and URL path, so a dedicated rule can trace checkout at 100 percent while the default rule keeps sampling low elsewhere. The context missing setting only controls SDK behavior when no segment exists, metadata is not indexed and does not change what is sampled, and toggling tracing per function does not affect path-level sampling within a shared API.",
    reference: "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html"
  },
  {
    id: 159,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A trading application publishes a custom CloudWatch metric for order-processing latency and must alarm within 10 seconds when latency spikes. The current alarm evaluates a 1 minute period and reacts too slowly. What should the developer change?",
    selectCount: 1,
    options: [
      { id: "A", text: "Publish the metric with StorageResolution set to 1 as a high-resolution metric and configure the alarm with a 10 second period." },
      { id: "B", text: "Enable detailed monitoring on the EC2 instances that run the application." },
      { id: "C", text: "Use a metric math expression that averages the last 10 seconds of the standard metric." },
      { id: "D", text: "Enable anomaly detection on the existing alarm." }
    ],
    answers: ["A"],
    explanation: "Standard custom metrics have 1 minute granularity, so no alarm on them can react in 10 seconds. High-resolution metrics are stored at 1 second granularity and support alarm periods of 10 or 30 seconds. Detailed monitoring affects built-in EC2 metrics only, metric math cannot create finer data than the source has, and anomaly detection changes the threshold model rather than the evaluation speed.",
    reference: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html#high-resolution-metrics"
  },
  {
    id: 160,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A Lambda function makes six independent HTTP calls to downstream services, one after another, and each call waits about 300 ms. The developer raised memory from 512 MB to 3,008 MB, which had no effect on duration but tripled cost. CPU utilization during invocations is under 5 percent. What should the developer do to reduce duration and cost?",
    selectCount: 1,
    options: [
      { id: "A", text: "Issue the six calls concurrently, for example with Promise.all, and lower the memory back toward 512 MB." },
      { id: "B", text: "Increase memory to 10,240 MB to obtain more vCPUs." },
      { id: "C", text: "Enable Provisioned Concurrency for the function." },
      { id: "D", text: "Increase the ephemeral storage so responses can be cached on disk." }
    ],
    answers: ["A"],
    explanation: "The function is I/O bound, so more CPU cannot help and the memory increase only raises the price per millisecond. Running the independent calls in parallel cuts wall-clock time from roughly 1.8 seconds to about 300 ms, and a lower memory setting is sufficient for that work. Provisioned Concurrency addresses cold starts, and disk space does not shorten network waits.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html"
  },
  {
    id: 161,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A CloudFront distribution in front of an API returns localized responses based on the Accept-Language header. The distribution's cache hit ratio is under 5 percent because the origin request policy forwards all viewer headers. The team wants to raise the hit ratio without serving the wrong language to any user. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Use a cache policy that includes only the Accept-Language header in the cache key and stops including the other headers." },
      { id: "B", text: "Set the minimum TTL to 24 hours so objects stay cached longer." },
      { id: "C", text: "Disable caching for the behavior and rely on the origin's own cache." },
      { id: "D", text: "Enable Origin Shield so all headers are normalized at the origin." }
    ],
    answers: ["A"],
    explanation: "Every header in the cache key creates a separate cache entry, and forwarding all headers makes nearly every request unique. Limiting the key to the single header that actually varies the response lets identical language requests share cached objects while keeping responses correct. Longer TTLs cannot fix a key that never repeats, disabling caching abandons the goal, and Origin Shield adds a caching layer without changing the key.",
    reference: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html"
  },
  {
    id: 162,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A newly created Lambda function returns correct results when tested, but its log group in CloudWatch Logs is never created and no log output can be found. The function uses a custom execution role written from scratch. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "The execution role lacks logs:CreateLogGroup, logs:CreateLogStream, and logs:PutLogEvents permissions." },
      { id: "B", text: "The function must be invoked at least 100 times before Lambda creates a log group." },
      { id: "C", text: "Active tracing must be enabled before Lambda can write logs." },
      { id: "D", text: "The function's log retention setting is zero days, so entries are deleted immediately." }
    ],
    answers: ["A"],
    explanation: "Lambda writes logs using the function's execution role, and a hand-written role that omits the CloudWatch Logs permissions in AWSLambdaBasicExecutionRole silently produces no logs. Log groups are created on first write, tracing is independent of logging, and retention cannot be set to zero.",
    reference: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html"
  },
  {
    id: 163,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A team wants a Slack channel notified within seconds whenever any CodeDeploy deployment in the account fails, without adding code to the applications being deployed. Which approach is the most direct?",
    selectCount: 1,
    options: [
      { id: "A", text: "Create an EventBridge rule for CodeDeploy deployment state-change events with state FAILURE, and target an SNS topic or a Lambda function that posts to Slack." },
      { id: "B", text: "Create a CloudWatch Logs metric filter on the CodeDeploy agent logs of each instance." },
      { id: "C", text: "Query CloudTrail every minute for CreateDeployment calls with error codes." },
      { id: "D", text: "Attach a CloudWatch alarm to each deployment group so it rolls back and notifies." }
    ],
    answers: ["A"],
    explanation: "CodeDeploy emits deployment and instance state-change events to EventBridge, and a rule matching FAILURE can fan out to SNS, Lambda, or a chat integration in near real time. Agent logs are per instance and would need the agent to run, CloudTrail records API calls rather than deployment outcomes and adds polling latency, and deployment group alarms trigger rollbacks based on metrics rather than reporting failures.",
    reference: "https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch-events.html"
  },
  {
    id: 164,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A developer deploys a REST API in API Gateway and calls it with curl. The response is HTTP 403 with the body {\"message\":\"Missing Authentication Token\"}. The method has authorization set to NONE and does not require an API key. What is the most likely cause?",
    selectCount: 1,
    options: [
      { id: "A", text: "The request path, HTTP method, or stage does not match any deployed resource, so API Gateway returns this message for the unknown route." },
      { id: "B", text: "The request must include SigV4 signature headers even when authorization is NONE." },
      { id: "C", text: "A usage plan is attached to the stage and the x-api-key header is missing." },
      { id: "D", text: "The Cognito authorizer's token has expired." }
    ],
    answers: ["A"],
    explanation: "Despite its wording, Missing Authentication Token is what API Gateway returns when no resource and method combination matches the request in the invoked stage, most commonly because the API was not redeployed after changes, the stage name is missing, or the method is wrong. Authorization NONE needs no signature, a missing API key returns Forbidden, and an expired Cognito token returns Unauthorized.",
    reference: "https://repost.aws/knowledge-center/api-gateway-authentication-token-errors"
  },
  {
    id: 165,
    domain: "Troubleshooting and Optimization",
    type: "single",
    prompt: "A consumer application built with the Kinesis Client Library (KCL) is falling behind. The stream's GetRecords.IteratorAgeMilliseconds metric keeps rising, consumer CPU is under 10 percent, and the DynamoDB table that the KCL created for lease tracking shows WriteThrottleEvents. What should the developer do?",
    selectCount: 1,
    options: [
      { id: "A", text: "Increase the provisioned write capacity of the KCL lease table, or switch it to on-demand mode." },
      { id: "B", text: "Add shards to the stream so more records can be read in parallel." },
      { id: "C", text: "Move the consumer to larger instances with more vCPUs." },
      { id: "D", text: "Increase the stream retention period so the consumer has more time to catch up." }
    ],
    answers: ["A"],
    explanation: "The KCL checkpoints and renews leases in its own DynamoDB table, which it creates with a small default capacity. When that table throttles, workers cannot checkpoint or acquire leases and processing stalls even though the stream and hosts are idle. Adding shards or CPU addresses a bottleneck that the metrics rule out, and retention only delays data loss without fixing throughput.",
    reference: "https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-consumers.html#shared-throughput-kcl-consumers-leasetable"
  }
];
