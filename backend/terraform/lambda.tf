data "archive_file" "generation" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/generation"
  output_path = "${path.module}/build/generation.zip"
}

data "archive_file" "code_generation" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/code-generation"
  output_path = "${path.module}/build/code-generation.zip"
}

resource "aws_cloudwatch_log_group" "generation" {
  name              = "/aws/lambda/${local.name_prefix}-generation"
  retention_in_days = local.log_retention_days
  tags              = local.common_tags
}

resource "aws_cloudwatch_log_group" "code_generation" {
  name              = "/aws/lambda/${local.name_prefix}-code-generation"
  retention_in_days = local.log_retention_days
  tags              = local.common_tags
}

resource "aws_lambda_function" "generation" {
  function_name = "${local.name_prefix}-generation"
  role          = aws_iam_role.lambda_execution.arn
  runtime       = "nodejs22.x"
  handler       = "generate.handler.handler"

  filename         = data.archive_file.generation.output_path
  source_code_hash = data.archive_file.generation.output_base64sha256

  timeout     = var.lambda_timeout
  memory_size = var.lambda_memory_size

  environment {
    variables = {
      GEMINI_API_KEY = var.gemini_api_key
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.generation
  ]

  tags = local.common_tags
}

resource "aws_lambda_function" "code_generation" {
  function_name = "${local.name_prefix}-code-generation"
  role          = aws_iam_role.lambda_execution.arn
  runtime       = "nodejs22.x"
  handler       = "code-generation.handler.handler"

  filename         = data.archive_file.code_generation.output_path
  source_code_hash = data.archive_file.code_generation.output_base64sha256

  timeout     = var.lambda_timeout
  memory_size = var.lambda_memory_size

  environment {
    variables = {
      GROQ_API_KEY = var.groq_api_key
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.code_generation
  ]

  tags = local.common_tags
}