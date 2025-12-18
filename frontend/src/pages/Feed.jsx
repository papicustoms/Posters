import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Feed() {
  const [posters, setPosters] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const fetchPosters = async () => {
    const res = await api.get("/posters");
    setPosters(res.data);
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/posters", { imageUrl, caption });
    setImageUrl("");
    setCaption("");
    fetchPosters();
  };

  return (
    <div>
      <h1>POSTERS FEED</h1>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button>Poster</button>
      </form>

      <hr />

      {/* FEED */}
      {posters.map((p) => (
        <div key={p._id} style={{ marginBottom: 40, borderBottom: "1px solid #ccc", paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={p.author.avatar} alt="avatar" width={40} height={40} style={{ borderRadius: "50%" }} />
            <strong>{p.author.username}</strong>
          </div>

          <img src={p.imageUrl} width="300" style={{ marginTop: 10 }} />
          <p>{p.caption}</p>

          {/* Like */}
          <button onClick={async () => { await api.post(`/posters/${p._id}/like`); fetchPosters(); }}>
            ❤️ {p.likes.length}
          </button>

          {/* Commentaires */}
          <div style={{ marginTop: 10 }}>
            {p.comments.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <img src={c.user.avatar} alt="avatar" width={25} height={25} style={{ borderRadius: "50%" }} />
                <p><strong>{c.user.username}</strong>: {c.text}</p>
              </div>
            ))}
          </div>

          {/* Ajouter commentaire */}
          <form onSubmit={async (e) => {
            e.preventDefault();
            const text = e.target.comment.value;
            if (!text) return;
            await api.post(`/posters/${p._id}/comment`, { text });
            e.target.reset();
            fetchPosters();
          }}>
            <input name="comment" placeholder="Ajouter un commentaire..." />
            <button>Envoyer</button>
          </form>
        </div>
      ))}

    </div>
  );
}
