import { useMemo, useState } from "react";
import {
  FiSearch,
  FiShield,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

type RoleItem = {
  ID: number;
  RoleName: "Admin" | "User";
};

type PositionItem = {
  ID: number;
  PositionName: string;
};

type UserItem = {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Profile: string;
  Location: string;
  RoleID: number;
  Role: RoleItem;
  PositionID: number;
  Position: PositionItem;
};

type SortKey = "Newest" | "Role: Admin First" | "Role: User First" | "Name A-Z";

const mockUsers: UserItem[] = [
  {
    ID: 1,
    FirstName: "Alex",
    LastName: "Johnson",
    Email: "alex.johnson@scanops.local",
    Phone: "0891234567",
    Profile: "https://i.pravatar.cc/200?img=12",
    Location: "SOC Company HQ",
    RoleID: 1,
    Role: { ID: 1, RoleName: "Admin" },
    PositionID: 1,
    Position: { ID: 1, PositionName: "Security Administrator" },
  },
  {
    ID: 2,
    FirstName: "Mina",
    LastName: "Walker",
    Email: "mina.walker@scanops.local",
    Phone: "0812345678",
    Profile: "https://i.pravatar.cc/200?img=32",
    Location: "Network Operations Center",
    RoleID: 2,
    Role: { ID: 2, RoleName: "User" },
    PositionID: 2,
    Position: { ID: 2, PositionName: "Vulnerability Analyst" },
  },
  {
    ID: 3,
    FirstName: "Daniel",
    LastName: "Carter",
    Email: "daniel.carter@scanops.local",
    Phone: "0823456789",
    Profile: "https://i.pravatar.cc/200?img=14",
    Location: "Internal Security Lab",
    RoleID: 2,
    Role: { ID: 2, RoleName: "User" },
    PositionID: 3,
    Position: { ID: 3, PositionName: "Network Engineer" },
  },
  {
    ID: 4,
    FirstName: "Sophia",
    LastName: "Miller",
    Email: "sophia.miller@scanops.local",
    Phone: "0834567890",
    Profile: "https://i.pravatar.cc/200?img=47",
    Location: "Threat Monitoring Center",
    RoleID: 2,
    Role: { ID: 2, RoleName: "User" },
    PositionID: 4,
    Position: { ID: 4, PositionName: "SOC Operator" },
  },
];

const roleBadgeClass = (role: "Admin" | "User") => {
  if (role === "Admin") {
    return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-400/20";
  }
  return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-400/20";
};

const positionBadgeClass = (position: string) => {
  const p = position.toLowerCase();

  if (p.includes("security")) {
    return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:border-violet-400/20";
  }
  if (p.includes("analyst")) {
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-400/20";
  }
  if (p.includes("engineer")) {
    return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:border-sky-400/20";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-400/20";
};

const index = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("Newest");
  const [openSort, setOpenSort] = useState(false);

  const users = useMemo(() => {
    const q = search.trim().toLowerCase();

    let filtered = mockUsers.filter((u) => {
      const blob = [
        u.FirstName,
        u.LastName,
        u.Email,
        u.Phone,
        u.Location,
        u.Role.RoleName,
        u.Position.PositionName,
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "Newest") return b.ID - a.ID;

      if (sortBy === "Role: Admin First") {
        if (a.Role.RoleName === b.Role.RoleName) {
          return a.FirstName.localeCompare(b.FirstName);
        }
        return a.Role.RoleName === "Admin" ? -1 : 1;
      }

      if (sortBy === "Role: User First") {
        if (a.Role.RoleName === b.Role.RoleName) {
          return a.FirstName.localeCompare(b.FirstName);
        }
        return a.Role.RoleName === "User" ? -1 : 1;
      }

      return `${a.FirstName} ${a.LastName}`.localeCompare(
        `${b.FirstName} ${b.LastName}`
      );
    });

    return filtered;
  }, [search, sortBy]);

  const handleEdit = (user: UserItem) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user: UserItem) => {
    console.log("Delete user:", user);
  };

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[26px] p-4 sm:p-5 md:p-6",
        "bg-white border border-gray-200/80 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)]",
        "dark:bg-[#08111f]/90 dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 right-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "28px 28px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[12px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
              <FiShield className="text-[13px]" />
              User Access Monitoring
            </div>

            <h2 className="mt-3 text-[22px] sm:text-[26px] font-semibold tracking-tight text-slate-900 dark:text-white">
              User Security Table
            </h2>

            <p className="mt-1 text-[13px] sm:text-[14px] text-slate-500 dark:text-white/55">
              Monitor administrator access, analyst accounts, and network
              security operators.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search firstname / lastname / email / phone / role..."
              className={[
                "w-full h-11 rounded-2xl pl-10 pr-4 text-[13px] outline-none transition",
                "border border-gray-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
              ].join(" ")}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenSort((s) => !s)}
              className={[
                "h-11 px-4 rounded-2xl inline-flex items-center gap-2 transition",
                "bg-white border border-gray-200/80 text-[13px] font-medium text-gray-700 hover:bg-gray-50",
                "dark:bg-white/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/8",
              ].join(" ")}
            >
              {sortBy}
              <FiChevronDown
                className={`transition ${
                  openSort ? "rotate-180" : ""
                } text-gray-400 dark:text-white/45`}
              />
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden z-20 border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                {(
                  [
                    "Newest",
                    "Role: Admin First",
                    "Role: User First",
                    "Name A-Z",
                  ] as SortKey[]
                ).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSortBy(opt);
                      setOpenSort(false);
                    }}
                    className={[
                      "w-full text-left px-4 py-3 text-[13px] transition",
                      sortBy === opt
                        ? "bg-cyan-50 text-cyan-700 font-semibold dark:bg-cyan-500/10 dark:text-cyan-200"
                        : "text-gray-700 hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/8",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-3xl border border-gray-200/80 bg-white/80 dark:border-white/10 dark:bg-white/3">
          <table className="min-w-275 w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-4 text-[12px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                  User
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                  Contact
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                  Location
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                  Role
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                  Position
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.ID}
                  className={[
                    "transition-colors",
                    "hover:bg-cyan-50/60 dark:hover:bg-white/4",
                  ].join(" ")}
                >
                  {/* User */}
                  <td
                    className={`px-4 py-4 ${
                      idx !== users.length - 1
                        ? "border-b border-gray-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.Profile}
                          alt={`${user.FirstName} ${user.LastName}`}
                          className="h-12 w-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-white/10"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff";
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-slate-900 dark:text-white/85 truncate">
                          {user.FirstName} {user.LastName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500 dark:text-white/50">
                          <FiUser className="text-[12px]" />
                          <span>ID: {user.ID}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td
                    className={`px-4 py-4 ${
                      idx !== users.length - 1
                        ? "border-b border-gray-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-white/75">
                        <FiMail className="text-[13px] text-cyan-600 dark:text-cyan-300" />
                        <span>{user.Email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-white/75">
                        <FiPhone className="text-[13px] text-violet-600 dark:text-violet-300" />
                        <span>{user.Phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td
                    className={`px-4 py-4 ${
                      idx !== users.length - 1
                        ? "border-b border-gray-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-white/75">
                      <FiMapPin className="text-[13px] text-emerald-600 dark:text-emerald-300" />
                      <span>{user.Location}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td
                    className={`px-4 py-4 ${
                      idx !== users.length - 1
                        ? "border-b border-gray-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold",
                        roleBadgeClass(user.Role.RoleName),
                      ].join(" ")}
                    >
                      {user.Role.RoleName === "Admin" ? (
                        <FiShield className="mr-1.5" />
                      ) : (
                        <FiUser className="mr-1.5" />
                      )}
                      {user.Role.RoleName}
                    </span>
                  </td>

                  {/* Position */}
                  <td
                    className={`px-4 py-4 ${
                      idx !== users.length - 1
                        ? "border-b border-gray-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold",
                        positionBadgeClass(user.Position.PositionName),
                      ].join(" ")}
                    >
                      <FiBriefcase className="mr-1.5" />
                      {user.Position.PositionName}
                    </span>
                  </td>

                  {/* Action */}
                  <td
                    className={`px-4 py-4 text-right ${
                      idx !== users.length - 1
                        ? "border-b border-gray-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className={[
                          "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors",
                          "text-cyan-600 bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200",
                          "dark:text-cyan-300 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/15 dark:active:bg-cyan-500/20",
                        ].join(" ")}
                        title="Edit user"
                        aria-label="Edit user"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className={[
                          "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors",
                          "text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200",
                          "dark:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/15 dark:active:bg-red-500/20",
                        ].join(" ")}
                        title="Delete user"
                        aria-label="Delete user"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-[14px] text-slate-500 dark:text-white/50"
                  >
                    No user data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openSort && (
        <button
          type="button"
          onClick={() => setOpenSort(false)}
          className="fixed inset-0 z-5 cursor-default"
          aria-label="Close sort overlay"
        />
      )}
    </section>
  );
};

export default index;