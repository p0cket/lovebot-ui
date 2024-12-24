type Props = {
  /**  some comment about props */
  variant: "red" | "green" | "yellow"
}

/**
 some comment about the Light component
 */
const Light = ({ variant = "green" }: Props) => {
  // const Light = (props: Props) => {
  return (
    <div>
      <h1
        style={{
          background: variant,
          borderRadius: "50%",
          width: "100px",
          height: "100px",
        }}
      >
        Light {JSON.stringify(variant)}
      </h1>
    </div>
  )
}

export default Light
