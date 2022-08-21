import "./users.scss";

type UsersProps = {
    isHost: boolean | void,
    isProponentReady: boolean | null,
    isOpponentJoined: boolean,
    isOpponentReady: boolean,
}

export const Users = (
    { isHost, isProponentReady, isOpponentJoined, isOpponentReady }: UsersProps,
) => {
    return (
        <table className="users">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Ready</th>
                </tr>
            </thead>
            <tbody>
                {isHost ? (
                    <>
                        <tr>
                            <td>You</td>
                            <td>Connected</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr>
                            <td>Opponent</td>
                            <td>{isOpponentJoined ? "Connected" : "Not connected"}</td>
                            <td dangerouslySetInnerHTML={{ __html: isOpponentReady ? "&#10003;" : "" }} />
                        </tr>
                    </>
                ) : (
                    <>
                        <tr>
                            <td>Host</td>
                            <td>Connected</td>
                            <td>&#10003;</td>
                        </tr>
                        <tr>
                            <td>You</td>
                            <td>Connected</td>
                            <td dangerouslySetInnerHTML={{ __html: isProponentReady ? "&#10003;" : "" }} />
                        </tr>
                    </>
                )}
            </tbody>
        </table>
    );
};
