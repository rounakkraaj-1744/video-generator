resource "aws_apigatewayv2_api" "http" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"

  # tags = local.common_tags
}

resource "aws_apigatewayv2_integration" "generation" {
  api_id           = aws_apigatewayv2_api.http.id
  integration_type = "AWS_PROXY"

  integration_method     = "POST"
  integration_uri        = aws_lambda_function.generation.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "code_generation" {
  api_id           = aws_apigatewayv2_api.http.id
  integration_type = "AWS_PROXY"

  integration_method     = "POST"
  integration_uri        = aws_lambda_function.code_generation.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "generation" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /generate"

  target = "integrations/${aws_apigatewayv2_integration.generation.id}"
}

resource "aws_apigatewayv2_route" "code_generation" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /code-generation/generate"

  target = "integrations/${aws_apigatewayv2_integration.code_generation.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  # tags = local.common_tags
}

resource "aws_lambda_permission" "generation_api" {
  statement_id  = "AllowApiGatewayGeneration"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.generation.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.http.execution_arn}/*/POST/generate"
}

resource "aws_lambda_permission" "code_generation_api" {
  statement_id  = "AllowApiGatewayCodeGeneration"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.code_generation.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.http.execution_arn}/*/POST/code-generation/generate"
}