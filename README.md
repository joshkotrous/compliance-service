# compliance-service

My solution consists of the following files and folders:

```
├── ADR
│   ├── ADR.md
├── Data Schema
│   ├── compliance-service-input-schema.json
│   ├── compliance-service-output-schema.json
│   └── state-configuration-schema.json
├── Diagrams
│   └── Compliance Service - System Diagram.pdf
├── Project Proposal.pdf
├── README.md
└── Solution
    ├── compliance-service
    │   ├── service.ts
    │   ├── state_configuration
    │   ├── tests
    │   │   └── service.test.ts
    ├── example
    │   ├── app.ts
    │   ├── state_configuration
    ├── lambda-layer.zip
    └── lambda.zip
```

- `ADR/ADR.md` - Architecture decision record. I notated key architecture decisions I made while designing this service and included my rationale and considerations.
- `Data Schema/compliance-service-input-schema.json` - the data schema of the input to be provided to the Compliance Service.
- `Data Schema/compliance-service-output-schema.json` - the data schema of the output to be returned by the Compliance Service.
- `Data Schema/state-configuration-schema.json` - the data schema of the configuration file we will store for each state.
- `Diagrams/Compliance Service - System Diagram.pdf` - diagrams to show the design of the system organized into Level 0 and Level 1 aggregation levels.
- `Project Proposal.pdf` - a set of slides summarizing the solution design, project management considerations, and how I would ensure the successful and timely delivery.
- `Solution/compliance-service` - my source code for the compliance service module.
  - `compliance-service/state_configuration` - Temporary state configuration data store for unit tests.
  - `compliance-service/tests` - unit tests for the compliance service built using Jest.
- `Solution/example` - an example of an app importing and invoking the Compliance Service.
  - The state configuration files are stored in `example/state_configuration` to represent the external state config data store. These can be updated with new fields to showcase the configuration capabilities.
  - The compliance service module has been published to npm and installed in the example. You can run the example with (requires `Node v20`):
    - `cd solution/example`
    - `npm install`
    - `npm start`
- `Solution/lambda-layer.zip` - the layer I deployed to AWS Lambda for the API example.
- `Solution/lambda.zip` - the Lambda I built for the API example that consumes the compliance service layer.

I experimented with making the module portable to AWS as a Lambda layer and deployed it to a public API. You can try it out with a `POST` request to `https://w3yh6cyjkggzpsn6dcm5tchokm0fxevg.lambda-url.us-east-1.on.aws/` with the following body:

```
{
  "product": {
      "productId": "4e7a3c97-8dcd-4d8d-a9f8",
      "productName": "Product",
      "strain": "sativa",
      "netWeight": "3.5g",
      "thcContent": "28.4%",
      "cbdContent": "19.4%",
      "batchNumber": "23421",
      "manufacturer": "Raw Garden",
      "manufacturingDate": "06-24-2024"
    },
    "states": ["NY", "CA", "NV"]
}
```

I added unit tests built with Jest to the compliance service module. These unit tests could be ran from the CI/CD pipeline when new PRs are opened and/or merged to ensure breaking changes never make it into the repository. The unit tests can be ran with:

- `cd solution/compliance-service`
- `npm install`
- `npm test`
