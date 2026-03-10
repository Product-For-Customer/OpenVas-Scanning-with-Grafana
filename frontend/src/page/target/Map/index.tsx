import React, { useMemo, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
    FiCpu,
    FiSearch,
    FiMapPin,
    FiExternalLink,
    FiNavigation,
    FiShield,
    FiRadio,
    FiActivity,
} from "react-icons/fi";

type DeviceStatus = "online" | "offline" | "warning";

type Device = {
    id: number;
    device_name: string;
    macc: string;
    lat: number;
    lng: number;
    ip: string;
    location: string;
    status: DeviceStatus;
    lastSeen: string;
    battery?: number;
    temperature?: number;
};

const MOCK_DEVICES: Device[] = [
    {
        id: 1,
        device_name: "Cisco Core Switch C9300",
        macc: "00:1B:54:AA:10:01",
        lat: 13.7563,
        lng: 100.5018,
        ip: "10.10.1.1",
        location: "Core Network Room",
        status: "online",
        lastSeen: "2026-03-10 10:15",
        battery: 100,
        temperature: 34,
    },
    {
        id: 2,
        device_name: "Dell PowerEdge R740",
        macc: "00:14:22:BB:20:02",
        lat: 13.7568,
        lng: 100.5024,
        ip: "10.10.10.20",
        location: "Server Rack A2",
        status: "warning",
        lastSeen: "2026-03-10 10:12",
        battery: 100,
        temperature: 47,
    },
    {
        id: 3,
        device_name: "MikroTik Edge Router",
        macc: "4C:5E:0C:CC:30:03",
        lat: 13.7559,
        lng: 100.5009,
        ip: "10.10.1.254",
        location: "WAN Edge Cabinet",
        status: "online",
        lastSeen: "2026-03-10 10:18",
        battery: 100,
        temperature: 36,
    },
    {
        id: 4,
        device_name: "FortiGate Firewall 100F",
        macc: "90:6C:AC:DD:40:04",
        lat: 13.7572,
        lng: 100.5031,
        ip: "10.10.0.254",
        location: "Security Rack Zone",
        status: "warning",
        lastSeen: "2026-03-10 10:10",
        battery: 100,
        temperature: 44,
    },
    {
        id: 5,
        device_name: "Aruba Access Point AP-515",
        macc: "3C:37:86:EE:50:05",
        lat: 13.7579,
        lng: 100.5012,
        ip: "10.10.2.15",
        location: "Office Floor 2",
        status: "offline",
        lastSeen: "2026-03-10 08:45",
        battery: 100,
        temperature: 31,
    },
];

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
        case "online":
            return "#10b981";
        case "warning":
            return "#f59e0b";
        case "offline":
            return "#ef4444";
        default:
            return "#64748b";
    }
};

const getStatusLabel = (status: DeviceStatus) => {
    switch (status) {
        case "online":
            return "Online";
        case "warning":
            return "Warning";
        case "offline":
            return "Offline";
        default:
            return "Unknown";
    }
};

const getStatusChipClass = (status: DeviceStatus) => {
    switch (status) {
        case "online":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/20";
        case "warning":
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/20";
        case "offline":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/20";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-white/70 dark:border-white/10";
    }
};

const getGoogleMapsLink = (lat: number, lng: number) =>
    `https://www.google.com/maps?q=${lat},${lng}`;

const DeviceMarker: React.FC<{
    device: Device;
    active: boolean;
    onClick: (device: Device) => void;
}> = ({ device, active, onClick }) => {
    const color = getStatusColor(device.status);

    return (
        <Marker longitude={device.lng} latitude={device.lat} anchor="bottom">
            <button
                type="button"
                onClick={() => onClick(device)}
                className="group relative outline-none"
            >
                <div
                    className={[
                        "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white shadow-md transition-all duration-200",
                        active ? "scale-110 ring-2 ring-sky-300" : "hover:scale-105",
                    ].join(" ")}
                >
                    <FiCpu className="text-[16px] text-slate-700" />
                    <span
                        className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: color }}
                    />
                </div>

                <div className="mt-1 rounded-full bg-slate-900/85 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow transition-all duration-200 group-hover:opacity-100">
                    {device.device_name}
                </div>
            </button>
        </Marker>
    );
};

const HeaderStatChip: React.FC<{
    label: string;
    value: number;
    status: DeviceStatus;
}> = ({ label, value, status }) => {
    return (
        <div
            className={[
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-medium",
                getStatusChipClass(status),
            ].join(" ")}
        >
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getStatusColor(status) }}
            />
            <span>{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
};

const DeviceMap: React.FC = () => {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(
        MOCK_DEVICES[0]
    );
    const [search, setSearch] = useState("");

    const filteredDevices = useMemo(() => {
        const keyword = search.toLowerCase().trim();
        if (!keyword) return MOCK_DEVICES;

        return MOCK_DEVICES.filter((device) => {
            return (
                device.device_name.toLowerCase().includes(keyword) ||
                device.macc.toLowerCase().includes(keyword) ||
                device.ip.toLowerCase().includes(keyword) ||
                device.location.toLowerCase().includes(keyword)
            );
        });
    }, [search]);

    const onlineCount = MOCK_DEVICES.filter((d) => d.status === "online").length;
    const warningCount = MOCK_DEVICES.filter((d) => d.status === "warning").length;
    const offlineCount = MOCK_DEVICES.filter((d) => d.status === "offline").length;

    return (
        <section
            className={[
                "relative overflow-hidden rounded-3xl",
                "bg-white border border-gray-200/80 shadow-sm",
                "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
            ].join(" ")}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
                            backgroundSize: "24px 24px",
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 overflow-hidden rounded-3xl">
                {/* Header */}
                <div className="border-b border-slate-200 px-4 py-4 sm:px-5 dark:border-white/10">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <div
                                    className={[
                                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                                        "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                                        "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                                    ].join(" ")}
                                >
                                    <FiShield className="text-[13px]" />
                                    <span className="text-[12px] font-semibold tracking-wide">
                                        Target Map Console
                                    </span>
                                </div>

                                <div
                                    className={[
                                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                                        "bg-slate-50 text-slate-600 border border-slate-200/80",
                                        "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                                    ].join(" ")}
                                >
                                    <FiRadio className="text-[12px] text-cyan-500" />
                                    <span className="text-[12px] font-medium">
                                        {MOCK_DEVICES.length} targets loaded
                                    </span>
                                </div>

                                <div
                                    className={[
                                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                                        "bg-slate-50 text-slate-600 border border-slate-200/80",
                                        "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                                    ].join(" ")}
                                >
                                    <FiActivity className="text-[12px] text-violet-500" />
                                    <span className="text-[12px] font-medium">
                                        Live device positioning
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/90">
                                Device Map
                            </h2>
                            <p className="mt-1 text-[12px] sm:text-[13px] text-gray-500 dark:text-white/55">
                                Mock location data with latitude and longitude
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <HeaderStatChip label="Online" value={onlineCount} status="online" />
                            <HeaderStatChip label="Warning" value={warningCount} status="warning" />
                            <HeaderStatChip label="Offline" value={offlineCount} status="offline" />
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]">
                    {/* Left panel */}
                    <div
                        className={[
                            "border-b border-slate-200 bg-slate-50/70 p-4",
                            "xl:border-b-0 xl:border-r",
                            "dark:border-white/10 dark:bg-white/3",
                        ].join(" ")}
                    >
                        <div className="relative mb-4">
                            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                            <input
                                type="text"
                                placeholder="Search device, MAC, IP..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={[
                                    "h-11 w-full rounded-2xl pl-11 pr-4 text-sm outline-none transition-all duration-200",
                                    "border border-slate-200 bg-white text-slate-700 focus:border-sky-400",
                                    "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:border-cyan-400/50",
                                ].join(" ")}
                            />
                        </div>

                        <div className="space-y-2 max-h-65 overflow-y-auto xl:max-h-175 pr-1">
                            {filteredDevices.map((device) => {
                                const active = selectedDevice?.id === device.id;
                                const color = getStatusColor(device.status);

                                return (
                                    <button
                                        key={device.id}
                                        type="button"
                                        onClick={() => setSelectedDevice(device)}
                                        className={[
                                            "w-full rounded-2xl border px-3 py-3 text-left transition-all duration-200",
                                            active
                                                ? "border-sky-200 bg-sky-50 dark:border-cyan-400/20 dark:bg-cyan-500/10"
                                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white/85">
                                                    {device.device_name}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-slate-500 dark:text-white/45">
                                                    {device.macc}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-slate-400 dark:text-white/35">
                                                    {device.location}
                                                </p>
                                            </div>

                                            <span
                                                className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}

                            {filteredDevices.length === 0 && (
                                <div
                                    className={[
                                        "rounded-2xl border border-dashed px-4 py-6 text-center text-sm",
                                        "border-slate-300 bg-white text-slate-500",
                                        "dark:border-white/10 dark:bg-white/5 dark:text-white/50",
                                    ].join(" ")}
                                >
                                    No matching devices
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="relative h-105 w-full md:h-140 xl:h-190">
                        <Map
                            initialViewState={{
                                longitude: 100.5020,
                                latitude: 13.7568,
                                zoom: 16,
                            }}
                            mapStyle={MAP_STYLE}
                            attributionControl={{ compact: true }}
                            dragRotate={false}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <NavigationControl position="top-right" />

                            {filteredDevices.map((device) => (
                                <DeviceMarker
                                    key={device.id}
                                    device={device}
                                    active={selectedDevice?.id === device.id}
                                    onClick={setSelectedDevice}
                                />
                            ))}

                            {selectedDevice && (
                                <Popup
                                    longitude={selectedDevice.lng}
                                    latitude={selectedDevice.lat}
                                    anchor="top"
                                    closeButton={true}
                                    closeOnClick={false}
                                    onClose={() => setSelectedDevice(null)}
                                    offset={16}
                                    maxWidth="300px"
                                >
                                    <div className="min-w-57.5 p-1">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span
                                                className="inline-flex h-2.5 w-2.5 rounded-full"
                                                style={{
                                                    backgroundColor: getStatusColor(selectedDevice.status),
                                                }}
                                            />
                                            <p className="text-sm font-semibold text-slate-800">
                                                {selectedDevice.device_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1 text-xs text-slate-600">
                                            <p>
                                                <span className="font-medium">Status:</span>{" "}
                                                {getStatusLabel(selectedDevice.status)}
                                            </p>
                                            <p>
                                                <span className="font-medium">MAC:</span>{" "}
                                                {selectedDevice.macc}
                                            </p>
                                            <p>
                                                <span className="font-medium">IP:</span>{" "}
                                                {selectedDevice.ip}
                                            </p>
                                            <p>
                                                <span className="font-medium">Location:</span>{" "}
                                                {selectedDevice.location}
                                            </p>
                                            <p>
                                                <span className="font-medium">Lat / Lng:</span>{" "}
                                                {selectedDevice.lat}, {selectedDevice.lng}
                                            </p>
                                        </div>

                                        <a
                                            href={getGoogleMapsLink(selectedDevice.lat, selectedDevice.lng)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100"
                                        >
                                            <FiNavigation className="text-[13px]" />
                                            Open in Google Maps
                                            <FiExternalLink className="text-[12px]" />
                                        </a>
                                    </div>
                                </Popup>
                            )}
                        </Map>

                        {/* Floating info */}
                        <div className="pointer-events-none absolute left-4 top-4">
                            <div
                                className={[
                                    "rounded-2xl px-3 py-2 text-xs font-medium backdrop-blur",
                                    "border border-white/70 bg-white/90 text-slate-700 shadow-md",
                                    "dark:border-white/10 dark:bg-[#0B1220]/90 dark:text-white/75 dark:shadow-none dark:ring-1 dark:ring-white/10",
                                ].join(" ")}
                            >
                                {filteredDevices.length} device{filteredDevices.length !== 1 ? "s" : ""} shown
                            </div>
                        </div>

                        {/* Selected device card */}
                        {selectedDevice && (
                            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-85">
                                <div
                                    className={[
                                        "overflow-hidden rounded-2xl backdrop-blur",
                                        "border border-white/70 bg-white/92 shadow-xl",
                                    ].join(" ")}
                                >
                                    <div className="border-b border-slate-200 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {selectedDevice.device_name}
                                                </p>
                                                <p className="truncate text-[11px] text-slate-500">
                                                    {selectedDevice.macc}
                                                </p>
                                            </div>

                                            <span
                                                className={[
                                                    "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                                                    selectedDevice.status === "online"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : selectedDevice.status === "warning"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                                            : "bg-rose-50 text-rose-700 border-rose-200",
                                                ].join(" ")}
                                            >
                                                {getStatusLabel(selectedDevice.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="space-y-2 text-xs text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <FiMapPin className="shrink-0 text-slate-400" />
                                                <span className="truncate">{selectedDevice.location}</span>
                                            </div>

                                            <p>
                                                <span className="font-medium text-slate-700">IP:</span>{" "}
                                                {selectedDevice.ip}
                                            </p>
                                            <p>
                                                <span className="font-medium text-slate-700">Last Seen:</span>{" "}
                                                {selectedDevice.lastSeen}
                                            </p>
                                            <p>
                                                <span className="font-medium text-slate-700">Battery:</span>{" "}
                                                {selectedDevice.battery ?? "-"}%
                                                <span className="mx-1.5 text-slate-300">•</span>
                                                <span className="font-medium text-slate-700">Temp:</span>{" "}
                                                {selectedDevice.temperature ?? "-"}°C
                                            </p>
                                            <p>
                                                <span className="font-medium text-slate-700">Lat / Lng:</span>{" "}
                                                {selectedDevice.lat}, {selectedDevice.lng}
                                            </p>
                                        </div>

                                        <a
                                            href={getGoogleMapsLink(selectedDevice.lat, selectedDevice.lng)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={[
                                                "mt-4 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-medium transition-all duration-200",
                                                "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
                                            ].join(" ")}
                                        >
                                            <FiNavigation className="text-[13px]" />
                                            Open in Google Maps
                                            <FiExternalLink className="text-[12px]" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeviceMap;