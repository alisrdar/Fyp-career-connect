import Image from "next/image";
import React from "react";

const Card = ({
  imageSrc,
  tag,
  readingTime,
  title,
  description,
  linkText = "Read more",
  href = "#",
  className = "",
}) => {
  const baseStyle =
    "bg-white dark:bg-surface rounded-lg overflow-hidden flex flex-col shadow-md dark:shadow-[0_4px_12px_rgba(255,255,255,0.05)]";

  return (
    <div className={`${className} ${baseStyle}`}>
      {/* Image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={title || "Card Image"}
          width={500}
          height={300}
          className="w-full h-48 object-cover block"
        />
      )}

      {/* Content */}
      <div className="p-4 md:p-6">
        {(tag || readingTime) && (
          <div className="flex items-center gap-3 text-xs text-muted dark:text-foreground-dark/70 mb-2">
            {tag && (
              <span className="px-2 py-1 bg-accent dark:bg-darkblue rounded text-foreground-light dark:text-foreground-dark text-xs font-semibold">
                {tag}
              </span>
            )}
            {readingTime && <span>{readingTime}</span>}
          </div>
        )}
        {title && (
          <h3 className="text-xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-foreground-light/70 dark:text-muted mb-4 text-sm leading-relaxed">
            {description}
          </p>
        )}
        {linkText && href && (
          <a
            href={href}
            className="text-primary hover:underline text-sm font-medium"
          >
            {linkText} →
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
