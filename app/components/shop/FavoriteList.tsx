import React from "react";
import { ThreeDCardDemo } from "./3DCard";

export default function FavoriteList({ data, user, favorite }: any) {
  return <ThreeDCardDemo data={data} user={user} favorite={favorite} />;
}
