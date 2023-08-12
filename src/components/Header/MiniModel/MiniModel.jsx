import React from 'react';
import './MiniModel.style.scss';
import { Link } from 'react-router-dom';
export const MiniModel = ({ id, name, image, isSelected, setIsMenuOn, onSelect }) => {
  return (
    <Link
      onClick={() => setIsMenuOn(false)}
      style={{ marginLeft: 5, marginRight: 5 }}
      to={`models/${id}`}>
      <div className={'mini-model'} onClick={onSelect}>
        <img
          className={`image-mini-model ${isSelected ? 'mini-model-selected' : ''}`}
          src={image}
          alt=""
        />
        <div>{name}</div>
      </div>
    </Link>
  );
};
