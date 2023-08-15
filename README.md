# User Management and Posts API Code-Challenge

## Setup

### Tools

- [Docker](https://docs.docker.com/engine/install/)
- [Docker-compose](https://docs.docker.com/compose/install/)
- [asdf](https://asdf-vm.com/guide/getting-started.html) for nodejs versioning (optional)

## Running the project

- Pull the project from my fork
- Start docker

  - From the `/api` directory, run `npm run docker:up`
  - You may need to ensure that docker desktop is running

- Run Prisma updates against the dockerized Postgres instance (run from the `/api` directory)

  - `npx prisma migrate dev`

- Start the API (run from the `/api` directory)
  - `npm run dev`
- Start the UI (run from the `/web` directory)

  - `npm run dev`

- The UI will most likely be available at http://localhost:3001 (since 3000 is taken by the nodejs server)

## Tests

The test approach was straight forward, with unit tests being written for most, if not all functions in the service, controller, and repository layers. This is where dependency injection came in handy for containing testing to the specified modules and ensuring dependencies were being called with the correct arguments and frequency.

### Tools

- mocha
- chai
- sinon

### Running tests

From the `/api` directory, run `npm run test`

## Approach

When approaching the project, it seemed natural to tackle the issues on a per-route basis (i.e. users and posts). The initial step I took, however, was to create a schema in Prisma and set up docker to run a local Postgres instance. While data modeling can be a natural first step, I found it interesting that the tooling influenced the project approach -- using Prisma allowed for rapid iteration and testing of the database tables itself. I also chose to take this step first so that I could kick the tires of this unfamiliar tool and catch any gotchas off the bat. From there, it was straightforward to start scaffolding the application while building out the first route. The architectural approach I took is heavily influenced by the Kotlin/Java projects I'm used to working on, granted I believe there will be trade-offs down the line if the app logic gets complex (more on that below). I used my usual approach of building projects with proper task segmentation seen in the PR history, complete with descriptions and testing plans per PR. Once I created the user and post routes, I got to work on the UI. Admittedly, I got caught up in it since I enjoy building projects a lot. Overall, I had fun building out this project. And I hope this is straightforward to follow. Happy clicking!

## Architectural Decisions

In building the backend application, several architectural decisions were made to ensure modularity, scalability, and maintainability. The architecture follows a service, controller, and repository pattern, heavily utilizing dependency injection for component modularity. The usage of Redis for session storage also contributes to the scalability of the system. Here are the key architectural decisions explained:

### Service-Controller-Repository Architecture:

The server application was structured around three layers, consisting of Service, Controller, and Repository layers. This separation of concerns promotes code organization and maintainability:

1. **Service Layer:**

   - Responsible for the business logic of the application.
   - Would ideally orchestrate actions, processes data, and enforces business rules.
   - Relies on repositories as a dependent to interface with data from the datastore.

2. **Controller Layer:**

   - Handles incoming requests and responses.
   - Acts as an interface between the client and the service layer.
   - Handles assigning HTTP statuses and response data based on return values of the service layer.

3. **Repository Layer:**
   - Manages data storage and retrieval.
   - Abstracts the database interaction and operations.
   - Provides an interface for the service layer to interact with the database.

### Dependency Injection:

The architecture heavily employs dependency injection to promote modularity and reduce tight coupling between components. By injecting dependencies into classes instead of creating them within the class, the application becomes more flexible and easier to test:

- Controllers receive service instances via constructor injection.
- Services receive repository instances via constructor injection.
- This approach allows for easy replacement of components and better unit testing.

#### Callout

While this is a sound approach and one I see in many other projects, those projects usually have DI factories to help construct classes and models with the appropriate dependencies. Nodejs seems like an interesting language to adapt this pattern to and I can see the DI becoming unruly once logic in the various layers becomes complex.

### Docker and Postgres:

A `docker-compose` file is utilized to set up a Postgres instance for both development and testing environments. Key decisions include:

- Using Docker allows for consistent environment setup.
- The Postgres instance is configured to have two databases, one for development and one for running tests.
- Integration tests utilize a real database, ensuring more thorough testing of the repository classes.

### Redis for Session Storage:

Redis is chosen as the session store for authentication. This is definitely overkill for this project, but thankfully docker-compose makes it easy to spin these things up. That, and I want to demonstrate my comfortability with these sorts of tools :D. The decision to choose Redis (in the real work) is based on several factors:

- Suitable for handling session data in a distributed system.
- Allows for scaling of the application across multiple instances.
- Session data can be stored persistently and accessed quickly.

### Benefits of Architectural Decisions:

- **Modularity and Reusability:** The separation of concerns into different layers promotes modularity and reusability of code components.
- **Testability:** The dependency injection approach and integration testing against the database ensure a higher level of test coverage and more reliable software.
- **Scalability:** The choice of Redis for session storage and Docker for environment setup lays the groundwork for future scalability needs.
- **Maintainability:** Clear separation of responsibilities and the use of established design patterns make the codebase more maintainable over time.

### Trade-offs - Prisma and modularity

In the development of the app, I noticed there could be some issues regarding the containment of database models within the repository layer. While the goal of the repositories were to contain data access models, it seems that Prisma can be quite pervasive throughout the app if not handled carefully. If Prisma cannot be contained, one might question the efficacy of the repository layer. One workaround (that was disregarded due to time constraints), is the addition of abstraction models between the service layer and its caller. With that approach, the Prisma model does not need to be a dependency to anything upstream of the service layer.

### Authentication

In developing the authentication feature, two main technologies were utilized -- `express-sessions` and `passport`. Passport provided a simple way to create new users and authenticate them based on existing sessions, while the session stores are used to save authenticated users to a session.

#### Callouts

Due to time constraints, the authentication feature does not have as much robust testing as it should. In addition, the user fetching is done directly with the Prisma client, breaking all rules around the architecture described above. I hesitated merging the PR for these reasons, along with some probable bugs, but I'll let the house decide for themselves.

## Errors

Currently, error responses from the API either return just a status or, if it is due to validation errors, a response in the shape of below. The code field provides a way for the UI to determine error messaging or something similar if the message shouldn't be displayed directly to the user.

```
{
  code: "SOME_CODE",
  message: "More details about the error"
}
```

## Additional functionality

- Adding state to posts
  - Create draft post
  - Post becomes active/published at certain time
- Paginated post list
- Bulk operations
  - Delete many posts at once
- Tagging posts
- OAuth client authentication
- Ability to like posts
- Ability to save posts
- Upload post image

## Conclusion

In conclusion, the architectural decisions taken for this project, including the service-controller-repository pattern, dependency injection, dockerized Postgres setup, and Redis for session storage, contribute to building a robust, modular, and scalable backend application for the API. My hope is that these decisions would lay a strong foundation for the evolution of the app.
