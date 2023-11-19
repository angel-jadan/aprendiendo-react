import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import { type User } from "./types";
import { UsersList } from "./components/UsersList";

enum SortBy {
  NONE = "none",
  NAME = "name",
  LAST = "last",
  COUNTRY = "country",
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // use Ref -> para guardar un estado
  // que queremos que se comprata entre renderizados
  // pero al cambiar, no vuelva a renderizar el componente
  const originalUsers = useRef<User[]>([]);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    const sortCountry = SortBy.NONE === sortBy ? SortBy.COUNTRY : SortBy.NONE
    setSortBy(sortCountry);
  };

  const handleDeleteUser = (email: string) => {
    const filterListUser = users.filter((user) => user.email !== email);
    setUsers(filterListUser);
  };

  const handleResetState = () => {
    setUsers(originalUsers.current);
  };

  const filteredUsers = useMemo(() => {
    return filterCountry !== null && filterCountry?.length > 0
      ? users.filter((user) =>
          user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase())
        )
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sortBy === SortBy.NONE) return filteredUsers;
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
      [SortBy.COUNTRY]: user => user.location.country,
    }
    return filteredUsers.toSorted((a, b) => {
      const extractProperties = compareProperties[sortBy]
      return extractProperties(a).localeCompare(extractProperties(b));
    })
  }, [filteredUsers, sortBy]);


  const handleChangeSort = (sort: SortBy) => {
    if (sortBy === sort) {
      setSortBy(SortBy.NONE)      
    } else {
      setSortBy(sort)
    }
  }


  return (
    <>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>Show Colors</button>
        <button onClick={toggleSortByCountry}>
          {sortBy === SortBy.COUNTRY ? "No ordenar por País" : "Ordenar por país"}
        </button>
        <button onClick={handleResetState}>Resetear estado</button>
        <input
          type="text"
          placeholder="Filtrar por país"
          onChange={(event) => {
            setFilterCountry(event.target.value);
          }}
        />
      </header>
      <main>
        <UsersList
          users={sortedUsers}
          showColors={showColors}
          deleteUser={handleDeleteUser}
          changeSort={handleChangeSort}
        />
      </main>
    </>
  );
}

export default App;
