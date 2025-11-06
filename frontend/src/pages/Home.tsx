import MusicPlayerCard from '../components/MusicPlayerCard'

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <MusicPlayerCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="https://via.placeholder.com/72" alt="cover" width={72} height={72} style={{ borderRadius: 8 }} />
                    <div>
                        <div style={{ fontWeight: 600 }}>Spotify</div>
                        <div style={{ opacity: 0.8 }}>Placeholder track</div>
                    </div>
                </div>
            </MusicPlayerCard>
        </div>
    )
}