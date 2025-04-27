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
  className= ""
}) => {
    const baseStyle= "rounded-lg shadow-md overflow-hidden bg-white dark:bg-surface"
  return (
    <div className={` ${className} ${baseStyle}`}>
      {/* Image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={title || "Card Image"}
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tag and Meta */}
        {(tag || readingTime) && (
          <div className="flex items-center gap-3 text-sm text-muted mb-2">
            {tag && (
              <span className="px-2 py-1 bg-accent rounded text-foreground-light dark:text-foreground-dark">
                {tag}
              </span>
            )}
            {readingTime && <span>{readingTime}</span>}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="text-xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-muted mb-4">{description}</p>
        )}

        {/* Link / Button */}
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
