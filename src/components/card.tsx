import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  icon?: string;
  primaryText: string;
  secondaryText?: string[];
  rightElement?: React.ReactNode;
  link?: string;
}

const Card: React.FC<CardProps> = ({
  icon,
  primaryText,
  secondaryText,
  rightElement,
  link,
}) => {
  const cardContent = (
    <>
      <div className="card-left">
        {icon && <img src={icon} alt="Icon" className="card-icon" />}
      </div>
      <div className="card-body">
        <h3 className="card-primary-text">{primaryText}</h3>
        {secondaryText && secondaryText.length > 0 && (
          <p className="card-secondary-text">
            {secondaryText.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </p>
        )}
      </div>
      <div className="card-right">{rightElement && rightElement}</div>
    </>
  );

  return (
    <div className="card">
      {link ? (
        <Link to={link} className="CardLink">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};
export default Card;
