const Wrapper = (props) => {
  const { children, flexbox } = props;

  return <div className={`Wrapper ${flexbo && "doflex"}`}>{children}</div>;
};

export default Wrapper;
