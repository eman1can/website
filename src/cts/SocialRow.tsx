import { find } from "../utils";


type SocialMediaRowProps = {
    size: number,
    website?: string,
    twitter?: string,
    letterboxd?: string

}

function SocialMediaRow({website, twitter, letterboxd, size}: SocialMediaRowProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyItems: 'center'
        }}>
            {website ? (<a
                href={website}
                rel="noopener noreferrer"
                target="_blank"
            >
                <img
                    style={{
                        height: size,
                        marginRight: size
                    }}
                    alt="website"
                    src={find('assets/cts', 'site.cvg')}
                />
            </a>) : null}
            {twitter ? (<a
                href={twitter}
                rel="noopener noreferrer"
                target="_blank"
            >
                <img
                    style={{
                        height: size,
                        marginRight: size
                    }}
                    alt="twitter"
                    src={find('assets/cts', 'twitter.svg')}
                />
            </a>) : null}
            {letterboxd ? (<a
                href={letterboxd}
                rel="noopener noreferrer"
                target="_blank"
            >
                <img
                    style={{height: size}}
                    alt="letterboxd"
                    src={find('assets/cts', 'letterboxd.svg')}
                />
            </a>) : null}
        </div>
    );
}

export default SocialMediaRow;
