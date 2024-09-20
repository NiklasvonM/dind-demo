# Docker-in-Docker Demo

This is a basic demonstration of using Docker-in-Docker (dind) to build a simple Docker image within a GitHub Actions workflow.

## How it works

- The `Dockerfile` defines a minimal Alpine Linux image that runs a `curl` command.
- The GitHub Actions workflow sets up a Docker Buildx environment and builds the image using the `Dockerfile`.
- The built image is tagged using the commit hash and pushed to the GitHub Container Registry.
- A basic test is performed to check if `curl` is available in the image.
- The image is then tagged with the branch name (ref slug) and pushed again to the registry.

## Configuration

### Secrets

- `GITHUB_TOKEN`: This secret is automatically provided by GitHub Actions and is used to authenticate with the GitHub Container Registry.

## Usage

1. Ensure you have a GitHub Container Registry enabled for your repository.
2. Update the `IMAGE_NAME` environment variable in `.github/workflows/build.yml` file to the name of your repository.
3. Commits and pull requests to main trigger the workflow.
4. The built and tested image will be available in your GitHub Container Registry using the commit ref slug.
