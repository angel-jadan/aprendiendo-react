import { type User } from "../types";

declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[];
  }
}

enum SortBy {
  NONE = "none",
  NAME = "name",
  LAST = "last",
  COUNTRY = "country",
}

interface Props {
  users: User[];
  showColors: boolean;
  deleteUser: (email: string) => void;
  changeSort: (sort: SortBy) => void
}

export function UsersList({ users, showColors, deleteUser, changeSort }: Props) {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Foto</th>
          <th onClick={() => changeSort(SortBy.NAME)}>Nombre</th>
          <th onClick={() => changeSort(SortBy.LAST)}>Apellido</th>
          <th onClick={() => changeSort(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user: User, index: number) => {
          const backgroudColor = index % 2 === 0 ? "#3333" : "#555";
          const color = showColors ? backgroudColor : "transparent";

          return (
            <tr key={user.email} style={{ background: color }}>
              <td>
                <img src={user.picture.thumbnail}></img>
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => deleteUser(user.email)}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
