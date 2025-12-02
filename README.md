# Git Flow For Diddy Bop March Madness

## 1. First clone the Repo:
```bash
git clone https://github.com/kanedeiley/The-Diddy-Bop-March-Madness.git
```

## 2. Fetch Remote changes
```bash
git pull origin main
```
## 3. Navigate, Install & Development

```bash
# move to the repo
cd The-Diddy-Bop-March-Madness
```
```bash
# install dependencies
npm i
```
```bash
# run local server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 3. **How Update the Main Branch** 

### Creating a Branch:

- `Main` branch is **protected**

- Before creating a seperate branch, get remote main changes:
```bash
git switch main
```
```bash
git pull
```
- Create a new branch
```bash
git checkout -b "feature/<feature-name>"
```
- When ready create a pull request `feature/<feature-name>` -> `main`

### Staying up to date with remote main:

- while in your local feature branch:
```bash
git pull
```

### Staying up to date with remote main:

- pushing changes from your local to remote

```bash
git add .
```
```bash
git commit -m "<update>"
```
```bash
git push origin head
```