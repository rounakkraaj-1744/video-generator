output "api_base_url" {
  value = aws_apigatewayv2_api.http.api_endpoint
}

output "generation_function_name" {
  value = aws_lambda_function.generation.function_name
}

output "code_generation_function_name" {
  value = aws_lambda_function.code_generation.function_name
}