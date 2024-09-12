"use client";

import { useLottie } from "lottie-react";
import StarLottie from "@public/lotties/star.json";

const style = {
  height: 150,
  position: "absolute",
  top: "0",
  right: "3rem",
};

export const Star = () => {
  const options = {
    animationData: StarLottie,
    loop: true,
    autoplay: true,
  };

  // @ts-ignore
  const { View } = useLottie(options, style);

  return View;
};
