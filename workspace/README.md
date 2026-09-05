# next-verify

A lightweight TypeScript CLI utility that verifies the build and runtime of an existing Next.js portfolio project.

## Installation

```bash
npm install -g next-verify
```

Or use it directly via `npx`:

```bash
npx next-verify verify-build --project ./my-portfolio
```

## Usage

```bash
next-verify verify-build [options]
```

### Options

- `-p, --project <path>` – Path to the Next.js project (default: current directory).
- `-t, --timeout <ms>` – Overall timeout in milliseconds (default: 300000).
- `--json` – Output the verification report in JSON format (suitable for CI pipelines).

The command performs the following steps:
1. Locates the Next.js project.
2. Detects the package manager (npm or Yarn).
3. Installs dependencies (`npm ci` or `yarn install --frozen-lockfile`).
4. Executes the project's build script.
5. Verifies that the `.next` folder and required artifacts exist.
6. Starts the production server on a random free port.
7. Performs an HTTP health‑check against `/`.
8. Stops the server and reports `PASS` or `FAIL`.

## Development

```bash
npm install
npm run build   # compile TypeScript
npm test        # run Jest tests
```

## License

MIT © 2024
