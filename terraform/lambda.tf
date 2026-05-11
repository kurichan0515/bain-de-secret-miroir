data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist"
  output_path = "${path.module}/../backend/function.zip"
}

resource "aws_lambda_function" "analyze" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project_name}-analyze"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handlers/analyze.handler"
  runtime          = "nodejs18.x"
  timeout          = 30
  memory_size      = 512
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      GEMINI_API_KEY = var.gemini_api_key
      NODE_ENV       = var.stage
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_cloudwatch_log_group.lambda_logs,
  ]
}
