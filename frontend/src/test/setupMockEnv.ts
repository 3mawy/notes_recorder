import dotenv from "dotenv";

// Load env test file and mock config-constants.
// Vite is in charge of populating those constants from the env files,
// but we are not running vite transformations here
dotenv.config({ path: ".env.test" });

jest.mock("../configConstants", () => {
  return process.env;
});
