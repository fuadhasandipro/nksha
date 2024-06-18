import React from "react"
import { styled } from "baseui"
import { Theme } from "baseui/theme"
import Common from "./Common"
import Scenes from "./Scenes"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  background: $theme.colors.white,
}))

const Graphic = ({ isLargeScreen }) => {
  return (
    <Container>
      <div className={`${isLargeScreen ? "block" : "hidden"}`}>
        <Scenes />
      </div>
      <Common />
    </Container>
  )
}

export default Graphic
