output "api_url" {
  description = "API GatewayのベースURL（VITE_API_URLに設定する）"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "lambda_function_name" {
  description = "Lambda関数名"
  value       = aws_lambda_function.analyze.function_name
}

output "cloudwatch_log_group" {
  description = "CloudWatchロググループ名"
  value       = aws_cloudwatch_log_group.lambda_logs.name
}

# フロントエンド関連
output "frontend_bucket_name" {
  description = "フロントエンド用S3バケット名（GitHub Secretsに設定）"
  value       = aws_s3_bucket.frontend.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFrontディストリビューションID（GitHub Secretsに設定）"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain" {
  description = "フロントエンドのURL"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
