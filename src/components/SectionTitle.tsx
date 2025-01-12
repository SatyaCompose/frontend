import React from "react";

const SectionTitle = ({ text }: { text: string }) => {
    return (
        <div
            style={{
                alignItems: "center",
                justifyContent: 'center',
                marginLeft: 175
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    margin: "16px 0",
                    maxWidth: "840px", // Adjust this to match your input box width
                }}
            >
                <div
                    style={{
                        flex: 1,
                        height: "1.5px",
                        backgroundColor: "#4ACF50",
                        marginRight: "8px",
                        maxWidth: "100px"
                    }}
                />
                <span
                    style={{
                        marginRight: "12px",
                        fontWeight: "bold",
                        color: "#4ACF50",
                        whiteSpace: "nowrap",
                    }}
                >
                    {text}
                </span>
                <div
                    style={{
                        flex: 1,
                        height: "1.5px",
                        backgroundColor: "#4ACF50",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default SectionTitle;
