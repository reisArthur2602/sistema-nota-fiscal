import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const Icon = () =>
    new ImageResponse(
        <div
            style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #4338ca 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
                position: 'relative',
            }}
        >
            {/* Inner highlight */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                }}
            />
            {/* Activity icon */}
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        </div>,
        { ...size },
    );

export default Icon;
