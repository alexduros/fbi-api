const username = process.env.npm_config_fbi_test_username || process.env.FBI_TEST_USERNAME;
const password = process.env.npm_config_fbi_test_password || process.env.FBI_TEST_PASSWORD;

export {
  username,
  password
};