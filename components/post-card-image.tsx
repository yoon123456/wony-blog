import Image from "next/image";

type PostCardImageProps = {
  src?: string;
  alt: string;
};

export default function PostCardImage({ src, alt }: PostCardImageProps) {
  if (!src) {
    return (
      <div className="mb-4 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-white bg-gradient-to-br from-rose-100 via-amber-50 to-sky-100 text-3xl">
        <span aria-hidden>✿</span>
      </div>
    );
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-white">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
      />
    </div>
  );
}
