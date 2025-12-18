import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Feed() {
  const { user, logout } = useContext(AuthContext);
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await api.get("/posters");
        setPosters(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosters();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Feed Posters</h1>
      <p>Connecté : {user?.username}</p>
      <button onClick={logout}>Se déconnecter</button>
      <hr />
      {posters.map((poster) => (
        <div key={poster._id} style={{ marginBottom: 20 }}>
          <p><strong>{poster.author.username}</strong></p>
          <img src={poster.imageUrl} alt="Poster" width={300} />
          <p>{poster.caption}</p>
          <p>Likes : {poster.likes.length}</p>
        </div>
      ))}
    </div>
  );
}
