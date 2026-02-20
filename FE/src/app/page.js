"use client";
import React, { useEffect } from "react";
import { Spin, Empty } from "antd";
import CardNote from "./components/CardNote";
import { useNote } from "./store/useNote";
import { useAuth } from "./store/useAuth";
import { colorForNote } from "./utils/color";
import { colors } from "./constants/colors";

export default function Home() {
  const { token } = useAuth();
  const { items, loading, loadPublic } = useNote();

  useEffect(() => {
    loadPublic({ page: 1, perPage: 12 })
  }, [loadPublic]);

  if (loading) {
    return <div className='py-10 flex justify-center'><Spin /></div>
  }

  if (!items.length) {
    return <div className='py-10'><Empty /></div>
  }
  console.log("colorForNote:", items.map(n => colorForNote(n, colors)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((note, i) => (
        <div key={i}>
          <CardNote note={note} bg={colorForNote(note, colors)}/>
        </div>
      ))}
    </div>
  );
}
