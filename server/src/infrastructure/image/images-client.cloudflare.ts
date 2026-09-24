import type { ImagesClient, StandardCompressRequest } from "./images-client.port";

export class CloudflareImagesClient implements ImagesClient {
	constructor(private readonly images: ImagesBinding) {}

	async standardCompress(request: StandardCompressRequest): Promise<string> {
		const imageStream = request.image.stream() as ReadableStream<Uint8Array>;
		const compressedImage = await this.images
			.input(imageStream)
			.transform({ width: 640 })
			.output({ format: "image/webp", quality: 70 });
		const response = new Response(compressedImage.image({ encoding: "base64" }));
		return await response.text();
	}
}
