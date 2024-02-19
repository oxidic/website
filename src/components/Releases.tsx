import useReleases from "../hooks/useReleases";

interface Props {
  amount?: number;
}

export default function Releases({ amount }: Props) {
  const { data: releases, isError, isLoading } = useReleases();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>An error occurred.</p>;
  if (!releases) return <p>No releases.</p>;

  const slicedReleases = releases.slice(0, amount);

  return (
    <select className="min-w-max px-4 py-2">
      {slicedReleases.map(release => (
        <option label={release.name} key={release.id} value={release.name}></option>
      ))}
    </select>
  );
}
