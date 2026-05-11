terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket         = "bsm-tfstate-344693946629"
    key            = "prod/terraform.tfstate"
    region         = "ap-northeast-1"
    use_lockfile   = true
    encrypt        = true
    profile        = "terraform-admin"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "terraform-admin"
}
