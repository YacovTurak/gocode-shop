import { useState } from "react";

export default function Text() {
    const [showText, setshowText] = useState(true);

    return (
        <div>
            <button
                onClick={() => {
                    setshowText(!showText);
                }}
            >
                {showText ? "hide" : "show"} text
            </button>
            <p>{showText && "this is the text"}</p>
        </div>
    );
}
