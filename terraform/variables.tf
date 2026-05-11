variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "プロジェクト名（リソース名のプレフィックス）"
  type        = string
  default     = "bsm"
}

variable "stage" {
  description = "デプロイステージ"
  type        = string
  default     = "prod"
}

variable "gemini_api_key" {
  description = "Google Gemini API キー"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "CORS許可オリジン"
  type        = list(string)
  default     = ["*"]
}
