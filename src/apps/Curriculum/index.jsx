export default function Curriculum() {
  // Enlace publico al curriculum
  const cvUrl = "https://rxresu.me/ramirorodcas1112/cv-rodriguezcastro-ramiro"; 

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <iframe
        src={cvUrl}
        title="Mi Currículum"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="fullscreen"
      />
    </div>
  );
}