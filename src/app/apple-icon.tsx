import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const AppleIcon = () =>
    new ImageResponse(
        <div
            style={{
                width: 180,
                height: 180,
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #4338ca 100%)',
                borderRadius: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            {/* Inner highlight */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 40,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                }}
            />
            {/* Activity icon */}
            <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        </div>,
        { ...size },
    );

export default AppleIcon;
