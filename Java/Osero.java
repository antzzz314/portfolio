import java.util.Scanner;

enum Piece{Black,White}

class Player{
    final Piece piece;
    int count=2;
    Player(Piece piece){this.piece = piece;}
    public String toString(){return piece+" "+count;}
}
class Board{
    private final Piece[][] grid = new Piece[8][8];
    private static enum Direction{
        N(-1,0),NE(-1,1),E(0,1),SE(1,1),S(1,0),SW(1,-1),W(0,-1),NW(-1,-1);
        final int drow,dcol;
        private Direction(int drow,int dcol){
            this.drow = drow;this.dcol=dcol;
        }
    }
    Board(){
        grid[3][3] = Piece.White;grid[3][4] = Piece.Black;
        grid[4][3] = Piece.Black;grid[4][4] = Piece.White;
    }
    boolean canPlace(Player player){
        int count;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid.length; j++) {
                for(Direction dir:Direction.values()){
                    count = canPlace2(player.piece, i, j, dir);
                    if(count>0)return true;
                }
            }
        }return false;     
    }
    private int canPlace2(Piece piece, int row, int col, Direction dir) {
        int nrow = row + dir.drow;
        int ncol = col + dir.dcol;
        Piece next = null;
        if((0<=nrow  && nrow<=7 && 0<=ncol && ncol<=7))
            next = grid[row+dir.drow][col+dir.dcol];
        if(next==null)
            return -1;
        if(next==piece)
            return 0;
        int count = canPlace2(piece,nrow,ncol,dir);            
        if(count>=0){
            next=piece;
            count++;
        }return count;
    }
    private int reverse(Piece piece,int row,int col,Direction dir){
        int nrow = row + dir.drow;
        int ncol = col + dir.dcol;
        Piece next = null;
        if((nrow>=0 && nrow < grid.length) &&
        (ncol >=0 && ncol <grid[nrow].length)){
            next = grid[nrow][ncol];
        }
        if(next==null)
            return -1;
        if(next==piece)
            return 0;
        int count = reverse(piece,nrow,ncol,dir);            
        if(count>=0){
            grid[nrow][ncol]=piece;
            count++;
        }
        return count;
    }
    int place(Player player,String position){
            int count =0;
            try {
                int row = position.charAt(0)-'1';
                int col = position.charAt(1)-'a';
                if(grid[row][col]!=null)
                    return -1;
                for(Direction dir:Direction.values()){
                    int n = reverse(player.piece,row,col,dir);
                    if(n>0){
                        count +=n;
                    }
                }
                if(count>0)
                    grid[row][col]=player.piece;
            } catch (Exception e) {
            }return count;
    }
    void display(){
        System.out.println(" a b c d e f g h");
        for(int i=0;i<grid.length;i++){
            System.out.print(i+1);
            for(int j=0;j<grid.length;j++){
                if(grid[i][j]==(null)){
                    System.out.print("□ ");
                }else if(grid[i][j].equals(Piece.White)){
                    System.out.print("● ");
                }else{
                    System.out.print("○ ");
                }
                if(j==7)System.out.println();
            }
        }
    }
}

public class Osero {
    public static void main(String[] args) {
        Player player,opponent;
        Board board = new Board();
        Scanner sc = new Scanner(System.in);
        while (true){
            System.out.println("黒/1か白/2かを選んで下さい");
            int x = sc.nextInt();
            if(x==1){
                player = new Player(Piece.Black);
                opponent = new Player(Piece.White);
                break;
            }else if(x==2){
                player = new Player(Piece.White);
                opponent = new Player(Piece.Black);
                break; 
            }
        }  
        while (true){
            if(board.canPlace(player)){
                int n; 
                while((n=board.place(player,prompt(player,board)))<=0);
                player.count +=n+1;
                opponent.count-=n;              
                if(player.count+opponent.count==8*8 || opponent.count==0){
                    board.display();
                    System.out.println("ゲーム終了");
                    if(player.count>opponent.count){
                        System.out.println(player.piece+"の勝利です");
                    }else if(player.count==opponent.count){
                        System.out.println("引き分けです");
                    }else{
                        System.out.println(opponent.piece+"の勝利です");
                    }
                    break;
                }
            }
            Player p = opponent;
            opponent = player;
            player = p;
        }
    }
    private static String prompt(Player player,Board board){
        Scanner sc = new Scanner(System.in);
        while (true){
            board.display();
            System.out.println(player.piece+"の手番です行列で入力してください　例3a");
            try{
                String str = sc.next();
                int c1 = str.charAt(0)-'1';
                int c2 = str.charAt(1)-'a';
                if(!(0<=c1 && c1<=7 && 0<=c2 && c2<=7)){
                    continue;
                }else{
                    return str;
                }   
            }catch(StringIndexOutOfBoundsException e){
            }
        }
    }
}