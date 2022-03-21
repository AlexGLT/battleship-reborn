interface DirectionButtonProps {
  onClick: () => void;
}

export const DirectionButton = ({ onClick }: DirectionButtonProps) => (
  <button className="port__direction-button" onClick={onClick}>Change direction</button>
);
