declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.ttf" {
  const value: ArrayBuffer;
  export default value;
}

declare module "*.jpeg" {
  const value: ArrayBuffer;
  export default value;
}

declare module "../.generated/client/*.txt" {
  const value: string;
  export default value;
}

declare module "../.generated/*.json" {
  const value: string;
  export default value;
}

declare module "*.ts?test=*" {}
